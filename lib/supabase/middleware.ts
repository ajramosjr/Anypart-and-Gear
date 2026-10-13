import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from "./config";

export async function updateSession(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const legacyHosts = new Set([
    "any-partandgear.com",
    "www.any-partandgear.com",
    "anypartandgear.com",
  ]);

  if (legacyHosts.has(hostname)) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.hostname = "www.anypartandgear.com";
    canonicalUrl.protocol = "https:";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const pathname = request.nextUrl.pathname;
  // Only the homepage, account entry points, policies and app infrastructure
  // are public. Match exact paths so similarly named member pages stay locked.
  const publicPaths = new Set([
    "/", "/login", "/reset-password", "/auth/callback", "/auth/signout",
    "/terms", "/privacy", "/affiliate-disclosure", "/community-guidelines",
    "/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/offline.html", "/sw.js",
  ]);
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const isPublicPage = publicPaths.has(normalizedPath) ||
    (request.method === "POST" && ["/api/visits", "/api/funnel"].includes(normalizedPath));
  function requireLogin() {
    const headers = { "Cache-Control": "private, no-store" };
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Sign in to access APG." }, { status: 401, headers });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + request.nextUrl.search);
    url.searchParams.set("access", "members");
    return NextResponse.redirect(url, { headers });
  }

  try {
    // Check if Supabase credentials are configured
    if (!hasSupabaseConfig()) {
      console.error("Missing Supabase environment variables");
      if (pathname === "/tech-wire" || pathname.startsWith("/tech-wire/") || pathname === "/_next/image") return new NextResponse(null, { status: 404 });
      if (!isPublicPage) return requireLogin();
      const unconfiguredResponse = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
      unconfiguredResponse.headers.set("Cache-Control", "private, no-store");
      return unconfiguredResponse;
    }

    let response = NextResponse.next({
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
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const protectsTechWire = pathname === "/tech-wire" || pathname.startsWith("/tech-wire/") || pathname === "/_next/image";
    if (protectsTechWire) {
      const { data, error } = await supabase.from("tech_wire_settings").select("enabled").eq("id", "tech-wire").maybeSingle();
      if ((error || data?.enabled !== true) && user?.app_metadata?.role !== "admin") return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
    }
    if (!user && !isPublicPage) {
      const redirect = requireLogin();
      response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
      return redirect;
    }

    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    if (pathname === "/tech-wire" || pathname.startsWith("/tech-wire/") || pathname === "/_next/image") return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
    if (!isPublicPage) return requireLogin();
    const fallbackResponse = NextResponse.next({
      request: { headers: request.headers },
    });
    fallbackResponse.headers.set("Cache-Control", "private, no-store");
    return fallbackResponse;
  }
}
