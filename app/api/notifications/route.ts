import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { supabaseUrl } from "@/lib/supabase/config";

type Kind = "message" | "transaction" | "review";
type EmailDetails = { recipientId: string; actorName: string; subject: string; heading: string; body: string; preference: "email_messages" | "email_transactions" | "email_reviews" };
const kinds = new Set<Kind>(["message", "transaction", "review"]);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
}

function emailHtml(details: EmailDetails) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.anypartandgear.com";
  return `<!doctype html><html><body style="margin:0;background:#f1f4f7;font-family:Arial,sans-serif;color:#071a35"><div style="max-width:560px;margin:0 auto;padding:32px 18px"><div style="background:#071a35;color:#f6b91b;padding:18px 22px;font-size:20px;font-weight:800">ANY PART &amp; GEAR</div><div style="background:#fff;padding:28px 22px;border:1px solid #dce2ea"><h1 style="font-size:24px;margin:0 0 14px">${escapeHtml(details.heading)}</h1><p style="line-height:1.65;color:#475569">${escapeHtml(details.body)}</p><a href="${siteUrl}/messages" style="display:inline-block;margin-top:10px;background:#f6b91b;color:#071a35;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:800">Open private messages</a><p style="margin-top:24px;font-size:12px;color:#7b8794">For your safety, Any Part &amp; Gear never includes private phone numbers or email addresses in marketplace messages. Manage email alerts in your account.</p></div></div></body></html>`;
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const payload = await request.json().catch(() => null) as { kind?: Kind; entityId?: string } | null;
  if (!payload?.kind || !kinds.has(payload.kind) || typeof payload.entityId !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!serviceKey) return NextResponse.json({ queued: false }, { status: 202 });
  const admin = createAdminClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const actorName = user.user_metadata?.full_name || user.email?.split("@")[0] || "A member";
  let details: EmailDetails | null = null;

  if (payload.kind === "message") {
    const { data: message } = await admin.from("messages").select("id,sender_id,conversation_id,conversations(buyer_id,seller_id)").eq("id", payload.entityId).single();
    const conversation = message?.conversations as unknown as { buyer_id: string; seller_id: string } | null;
    if (!message || message.sender_id !== user.id || !conversation) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    details = { recipientId: conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id, actorName, preference: "email_messages", subject: `New private message from ${actorName}`, heading: "You have a new private message", body: `${actorName} sent you a message about an Any Part & Gear marketplace conversation.` };
  } else if (payload.kind === "transaction") {
    const { data: transaction } = await admin.from("transactions").select("id,conversation_id,conversations(buyer_id,seller_id)").eq("id", payload.entityId).single();
    const conversation = transaction?.conversations as unknown as { buyer_id: string; seller_id: string } | null;
    if (!transaction || !conversation || ![conversation.buyer_id, conversation.seller_id].includes(user.id)) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    details = { recipientId: conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id, actorName, preference: "email_transactions", subject: `${actorName} confirmed your exchange`, heading: "Exchange confirmation received", body: `${actorName} marked your marketplace exchange as completed. Open the conversation to confirm your side.` };
  } else {
    const { data: review } = await admin.from("reviews").select("id,reviewer_id,reviewee_id,rating").eq("id", payload.entityId).single();
    if (!review || review.reviewer_id !== user.id) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    details = { recipientId: review.reviewee_id, actorName, preference: "email_reviews", subject: `You received a verified ${review.rating}-star review`, heading: "You received a verified review", body: `${actorName} left you a verified ${review.rating}-star review on Any Part & Gear.` };
  }

  const { data: preference } = await admin.from("notification_preferences").select(details.preference).eq("user_id", details.recipientId).maybeSingle();
  const preferenceValues = preference as Record<string, boolean> | null;
  if (!resendKey || (preferenceValues && preferenceValues[details.preference] === false)) return NextResponse.json({ email: false });
  const { data: recipient } = await admin.auth.admin.getUserById(details.recipientId);
  if (!recipient.user?.email) return NextResponse.json({ email: false });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `apg-${payload.kind}-${payload.entityId}` },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || "Any Part & Gear <notifications@any-partandgear.com>", to: [recipient.user.email], subject: details.subject, html: emailHtml(details) }),
  });
  if (!response.ok) { console.error("Resend notification failed", response.status, await response.text()); return NextResponse.json({ email: false }, { status: 202 }); }
  return NextResponse.json({ email: true });
}
