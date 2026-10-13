import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { funnelEvents, trafficSources } from "@/lib/funnel";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return new NextResponse(null, { status: 403 });
  if (/bot|crawler|spider|headless|lighthouse|facebookexternalhit|preview/i.test(request.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
  if (Number(request.headers.get("content-length")) > 256) return new NextResponse(null, { status: 413 });
  let payload: { event?: unknown; source?: unknown };
  try {
    const body = await request.text();
    if (body.length > 256) return new NextResponse(null, { status: 413 });
    payload = JSON.parse(body);
    if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
  } catch { return new NextResponse(null, { status: 400 }); }
  if (!funnelEvents.includes(payload.event as typeof funnelEvents[number]) || !trafficSources.includes(payload.source as typeof trafficSources[number])) return new NextResponse(null, { status: 400 });
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user?.app_metadata?.role === "admin") return new NextResponse(null, { status: 204 });
  const saved = request.cookies.get("apg-visitor")?.value;
  const visitorId = saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved) ? saved : randomUUID();
  const { error } = await supabase.rpc("record_apg_funnel", { p_visitor_id: visitorId, p_event: payload.event, p_source: payload.source });
  if (error) return new NextResponse(null, { status: 503 });
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set("apg-visitor", visitorId, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}
