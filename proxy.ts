import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/_next/image") {
    const image = request.nextUrl.searchParams.get("url") || "";
    let path = image;
    try { path = new URL(image, request.nextUrl.origin).pathname; } catch { /* Invalid image URLs are handled by Next. */ }
    if (!path.startsWith("/tech-wire/")) return NextResponse.next();
  }
  return updateSession(request);
}
// The standalone educational guides contains no account data.
export const config = { matcher: ["/tech-wire/:path*", "/_next/image", "/((?!(?:engine-preview|how-things-work)\\.html$|_next/static|_next/image|favicon.ico|APG\\.vcf$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
