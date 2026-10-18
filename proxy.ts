import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  // This public stylesheet contains no account or membership data.
  if (request.nextUrl.pathname === "/apg-interactions.css") return NextResponse.next();
  if (request.nextUrl.pathname === "/_next/image") {
    const image = request.nextUrl.searchParams.get("url") || "";
    let path = image;
    try { path = new URL(image, request.nextUrl.origin).pathname; } catch { /* Invalid image URLs are handled by Next. */ }
    if (!path.startsWith("/tech-wire/")) return NextResponse.next();
  }
  return updateSession(request);
}
// Standalone HTML guides also require membership.
export const config = { matcher: ["/tech-wire/:path*", "/_next/image", "/((?!_next/static|_next/image|favicon.ico|APG\\.vcf$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
