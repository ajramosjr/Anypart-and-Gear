import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return new NextResponse(null, { status: 403 });
  if (/bot|crawler|spider|headless|lighthouse|facebookexternalhit|preview/i.test(request.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user?.app_metadata?.role === "admin") return new NextResponse(null, { status: 204 });
  const month = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "numeric", year: "numeric" }).format(new Date());
  if (request.cookies.get("apg-visit-month")?.value === month) return new NextResponse(null, { status: 204 });
  const saved = request.cookies.get("apg-visitor")?.value;
  const visitorId = saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved) ? saved : randomUUID();
  const { error } = await supabase.rpc("record_apg_visitor", { p_visitor_id: visitorId });
  if (error) return new NextResponse(null, { status: 503 });
  const response = new NextResponse(null, { status: 204 });
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 365 };
  response.cookies.set("apg-visitor", visitorId, options);
  response.cookies.set("apg-visit-month", month, options);
  return response;
}
