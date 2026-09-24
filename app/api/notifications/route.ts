import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { sendPushNotifications } from "@/lib/push";
import { supabaseUrl } from "@/lib/supabase/config";

type Kind = "message" | "transaction" | "review" | "part_request";
type NotificationDetails = {
  recipientId: string;
  actorName: string;
  subject: string;
  heading: string;
  body: string;
  preference: "email_messages" | "email_transactions" | "email_reviews";
  link: string;
  conversationId?: string | null;
  listingId?: string | null;
  transactionId?: string | null;
};
const kinds = new Set<Kind>(["message", "transaction", "review", "part_request"]);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
}

function emailHtml(details: NotificationDetails) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.anypartandgear.com";
  return `<!doctype html><html><body style="margin:0;background:#f1f4f7;font-family:Arial,sans-serif;color:#071a35"><div style="max-width:560px;margin:0 auto;padding:32px 18px"><div style="background:#071a35;color:#f6b91b;padding:18px 22px;font-size:20px;font-weight:800">ANY PART &amp; GEAR</div><div style="background:#fff;padding:28px 22px;border:1px solid #dce2ea"><h1 style="font-size:24px;margin:0 0 14px">${escapeHtml(details.heading)}</h1><p style="line-height:1.65;color:#475569">${escapeHtml(details.body)}</p><a href="${siteUrl}${details.link}" style="display:inline-block;margin-top:10px;background:#f6b91b;color:#071a35;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:800">Open APG</a><p style="margin-top:24px;font-size:12px;color:#7b8794">For your safety, Any Part &amp; Gear never includes private phone numbers or email addresses in marketplace messages. Manage email alerts in your account.</p></div></div></body></html>`;
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
  let details: NotificationDetails | null = null;

  if (payload.kind === "part_request") {
    const { data: partRequest } = await admin
      .from("part_requests")
      .select("id,requester_id,item_type,part_name,location,status,expires_at")
      .eq("id", payload.entityId)
      .single();
    if (!partRequest || partRequest.requester_id !== user.id || partRequest.status !== "active" || new Date(partRequest.expires_at) <= new Date()) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentRequestCount } = await admin
      .from("part_requests")
      .select("id", { count: "exact", head: true })
      .eq("requester_id", user.id)
      .gte("created_at", oneDayAgo);
    if ((recentRequestCount || 0) > 5) {
      return NextResponse.json({ error: "Daily business alert limit reached", inApp: 0, push: 0 }, { status: 429 });
    }

    const { data: shops } = await admin
      .from("shops")
      .select("owner_id")
      .eq("is_verified", true)
      .eq("is_active", true)
      .neq("owner_id", user.id);
    const recipientIds = [...new Set((shops || []).map((shop) => shop.owner_id).filter(Boolean))] as string[];
    if (!recipientIds.length) return NextResponse.json({ inApp: 0, push: 0 });

    const link = `/parts-wanted/${partRequest.id}`;
    const { data: existing } = await admin
      .from("notifications")
      .select("user_id")
      .eq("notification_type", "part_request")
      .eq("link", link)
      .in("user_id", recipientIds);
    const alreadyNotified = new Set((existing || []).map((item) => item.user_id));
    const newRecipients = recipientIds.filter((id) => !alreadyNotified.has(id));
    if (!newRecipients.length) return NextResponse.json({ inApp: 0, push: 0, duplicate: true });

    const requestLabel = partRequest.part_name?.trim() || partRequest.item_type;
    const heading = "New local Parts Wanted request";
    const body = `${requestLabel} requested in ${partRequest.location}. Respond through APG if your business can help.`;
    const { error: notificationError } = await admin.from("notifications").insert(newRecipients.map((recipientId) => ({
      user_id: recipientId,
      actor_id: user.id,
      notification_type: "part_request",
      title: heading,
      body,
      link,
    })));
    if (notificationError) {
      console.error("[notifications] Parts Wanted insert failed", { code: notificationError.code });
      return NextResponse.json({ inApp: 0, push: 0 }, { status: 202 });
    }

    const pushResults = await Promise.all(newRecipients.map((recipientId) => sendPushNotifications(admin, recipientId, {
      title: heading,
      body,
      url: link,
      tag: `apg-part-request-${partRequest.id}`,
    })));
    return NextResponse.json({ inApp: newRecipients.length, push: pushResults.reduce((total, count) => total + count, 0) });
  }

  if (payload.kind === "message") {
    const { data: message } = await admin.from("messages").select("id,sender_id,conversation_id,conversations(buyer_id,seller_id,listing_id)").eq("id", payload.entityId).single();
    const conversation = message?.conversations as unknown as { buyer_id: string; seller_id: string; listing_id: string | null } | null;
    if (!message || message.sender_id !== user.id || !conversation) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    details = { recipientId: conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id, actorName, preference: "email_messages", subject: `New private message from ${actorName}`, heading: "You have a new private message", body: `${actorName} sent you a message about an Any Part & Gear marketplace conversation.`, link: `/messages?chat=${message.conversation_id}`, conversationId: message.conversation_id, listingId: conversation.listing_id };
  } else if (payload.kind === "transaction") {
    const { data: transaction } = await admin.from("transactions").select("id,conversation_id,conversations(buyer_id,seller_id)").eq("id", payload.entityId).single();
    const conversation = transaction?.conversations as unknown as { buyer_id: string; seller_id: string } | null;
    if (!transaction || !conversation || ![conversation.buyer_id, conversation.seller_id].includes(user.id)) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    details = { recipientId: conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id, actorName, preference: "email_transactions", subject: `${actorName} confirmed your exchange`, heading: "Exchange confirmation received", body: `${actorName} marked your marketplace exchange as completed. Open the conversation to confirm your side.`, link: `/messages?chat=${transaction.conversation_id}`, conversationId: transaction.conversation_id, transactionId: transaction.id };
  } else {
    const { data: review } = await admin.from("reviews").select("id,reviewer_id,reviewee_id,rating,transaction_id").eq("id", payload.entityId).single();
    if (!review || review.reviewer_id !== user.id) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    details = { recipientId: review.reviewee_id, actorName, preference: "email_reviews", subject: `You received a verified ${review.rating}-star review`, heading: "You received a verified review", body: `${actorName} left you a verified ${review.rating}-star review on Any Part & Gear.`, link: "/account", transactionId: review.transaction_id };
  }

  const [{ error: notificationError }, pushCount] = await Promise.all([
    admin.from("notifications").insert({
      user_id: details.recipientId,
      actor_id: user.id,
      notification_type: payload.kind,
      title: details.heading,
      body: details.body,
      link: details.link,
      listing_id: details.listingId || null,
      conversation_id: details.conversationId || null,
      transaction_id: details.transactionId || null,
    }),
    sendPushNotifications(admin, details.recipientId, { title: details.heading, body: details.body, url: details.link, tag: `apg-${payload.kind}-${payload.entityId}` }),
  ]);
  if (notificationError) console.error("[notifications] in-app insert failed", { code: notificationError.code, kind: payload.kind });

  const { data: preference } = await admin.from("notification_preferences").select(details.preference).eq("user_id", details.recipientId).maybeSingle();
  const preferenceValues = preference as Record<string, boolean> | null;
  if (!resendKey || (preferenceValues && preferenceValues[details.preference] === false)) return NextResponse.json({ inApp: !notificationError, push: pushCount, email: false });
  const { data: recipient } = await admin.auth.admin.getUserById(details.recipientId);
  if (!recipient.user?.email) return NextResponse.json({ inApp: !notificationError, push: pushCount, email: false });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `apg-${payload.kind}-${payload.entityId}` },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || "Any Part & Gear <notifications@any-partandgear.com>", to: [recipient.user.email], subject: details.subject, html: emailHtml(details) }),
  });
  if (!response.ok) { console.error("Resend notification failed", response.status, await response.text()); return NextResponse.json({ inApp: !notificationError, push: pushCount, email: false }, { status: 202 }); }
  return NextResponse.json({ inApp: !notificationError, push: pushCount, email: true });
}
