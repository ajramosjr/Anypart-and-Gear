import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type SubscriptionPayload = {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
};

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in again to enable alerts." }, { status: 401 });
  const payload = await request.json().catch(() => null) as SubscriptionPayload | null;
  const endpoint = typeof payload?.endpoint === "string" ? payload.endpoint : "";
  const p256dh = typeof payload?.keys?.p256dh === "string" ? payload.keys.p256dh : "";
  const auth = typeof payload?.keys?.auth === "string" ? payload.keys.auth : "";
  if (!endpoint.startsWith("https://") || endpoint.length > 4096 || !p256dh || p256dh.length > 1024 || !auth || auth.length > 1024) {
    return NextResponse.json({ error: "The phone notification subscription was not valid." }, { status: 400 });
  }
  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    { user_id: user.id, endpoint, p256dh, auth, user_agent: request.headers.get("user-agent")?.slice(0, 500) || null },
    { onConflict: "endpoint" },
  );
  if (error) return NextResponse.json({ error: "Phone alerts could not be enabled." }, { status: 400 });
  return NextResponse.json({ enabled: true });
}

export async function DELETE(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Sign in again to change alerts." }, { status: 401 });
  const payload = await request.json().catch(() => null) as { endpoint?: unknown } | null;
  const endpoint = typeof payload?.endpoint === "string" ? payload.endpoint : "";
  if (!endpoint) return NextResponse.json({ error: "Missing subscription." }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Phone alerts could not be disabled." }, { status: 400 });
  return NextResponse.json({ enabled: false });
}
