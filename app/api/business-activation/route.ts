import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { supabaseUrl } from "@/lib/supabase/config";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload.shopId !== "string" || !/^[0-9a-f-]{36}$/i.test(payload.shopId) || !["request", "approved"].includes(payload.action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!key) return NextResponse.json({ notified: false }, { status: 202 });
  const admin = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: shop } = await admin.from("shops").select("id,owner_id,name,is_verified,is_active").eq("id", payload.shopId).single();
  const approved = payload.action === "approved";
  if (!shop || !shop.is_active || (approved ? user.app_metadata?.role !== "admin" || !shop.is_verified : shop.owner_id !== user.id || shop.is_verified)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  const recipientIds: string[] = [];
  if (approved) recipientIds.push(shop.owner_id);
  else {
    // Administrator privileges come from server-managed metadata, never user_metadata.
    for (let page = 1; ; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) return NextResponse.json({ notified: false }, { status: 202 });
      recipientIds.push(...data.users.filter((account) => account.app_metadata?.role === "admin").map((account) => account.id));
      if (data.users.length < 1000) break;
    }
  }
  const link = approved ? "/shops/register" : "/admin";
  const type = approved ? "business_activation_approved" : "business_activation_request";
  const body = approved ? `${shop.name}: APG Messages enabled. You can now view and respond to Parts Wanted requests.` : `${shop.name} submitted a business activation request. Confirm the representative before approving activation.`;
  if (!recipientIds.length) return NextResponse.json({ notified: false }, { status: 202 });
  const { data: existing, error: lookupError } = await admin.from("notifications").select("user_id").eq("notification_type", type).eq("body", body).in("user_id", recipientIds);
  if (lookupError) return NextResponse.json({ notified: false }, { status: 202 });
  const notified = new Set((existing || []).map((entry) => entry.user_id));
  const rows = recipientIds.filter((id) => !notified.has(id)).map((id) => ({ user_id: id, actor_id: user.id, notification_type: type, title: approved ? "APG Messages enabled" : "Business activation request", body, link }));
  if (!rows.length) return NextResponse.json({ notified: true, duplicate: true });
  const { error } = await admin.from("notifications").insert(rows);
  return NextResponse.json({ notified: !error }, { status: error ? 202 : 200 });
}
