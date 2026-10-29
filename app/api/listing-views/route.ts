import { createHmac, randomUUID } from "node:crypto";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseUrl } from "@/lib/supabase/config";
import { z } from "zod";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return new NextResponse(null, { status: 403 });
  if (/bot|crawler|spider|headless|lighthouse|facebookexternalhit|preview/i.test(request.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
  if (Number(request.headers.get("content-length")) > 200) return new NextResponse(null, { status: 413 });
  const body = await request.text();
  if (body.length > 200) return new NextResponse(null, { status: 413 });
  const parsed = z.object({ listingId: z.string().uuid() }).safeParse(await Promise.resolve().then(() => JSON.parse(body)).catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return new NextResponse(null, { status: 503 });
  const db = await createClient();
  const { data: { user }, error: authError } = await db.auth.getUser();
  // A missing session is normal; other auth failures must not count owner visits.
  if (authError && authError.name !== "AuthSessionMissingError") return new NextResponse(null, { status: 503 });
  const { data: listing, error } = await db.from("listings").select("user_id").eq("id", parsed.data.listingId).eq("status", "active").maybeSingle();
  if (error) return new NextResponse(null, { status: 503 });
  if (!listing) return new NextResponse(null, { status: 404 });
  if (user?.id === listing.user_id || user?.app_metadata?.role === "admin") return new NextResponse(null, { status: 204 });
  const saved = request.cookies.get("apg-visitor")?.value;
  const visitor = saved && z.string().uuid().safeParse(saved).success ? saved : randomUUID();
  const day = new Date().toISOString().slice(0, 10);
  const viewerHash = createHmac("sha256", secret).update(`listing-view:${day}:${user?.id || visitor}`).digest("hex");
  const admin = createAdminClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: writeError } = await admin.rpc("record_listing_view", { p_listing_id: parsed.data.listingId, p_viewer_hash: viewerHash, p_viewer_user_id: user?.id || null });
  if (writeError) { console.error("Listing view recording failed", writeError.code); return new NextResponse(null, { status: 503 }); }
  const response = new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  response.cookies.set("apg-visitor", visitor, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}
