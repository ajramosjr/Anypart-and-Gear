import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from "./config";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicPrefixes = [
    "/auth",
    "/api",
    "/login",
    "/listing",
    "/shops",
    "/safety",
    "/tech-wire",
    "/terms",
    "/privacy",
    "/affiliate-disclosure",
    "/community-guidelines",
    "/trust",
    "/support",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/offline.html",
    "/sw.js",
  ];
  const isPublicPage = pathname === "/" || publicPrefixes.some((page) => pathname.startsWith(page));

  try {
    // Check if Supabase credentials are configured
    if (!hasSupabaseConfig()) {
      console.error("Missing Supabase environment variables");
      const unconfiguredResponse = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
      unconfiguredResponse.headers.set("Cache-Control", "private, no-store");
      return unconfiguredResponse;
    }

    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    if (!isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    const fallbackResponse = NextResponse.next({
      request: { headers: request.headers },
    });
    fallbackResponse.headers.set("Cache-Control", "private, no-store");
    return fallbackResponse;
  }
}
