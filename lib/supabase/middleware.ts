import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  try {
    // Check if Supabase credentials are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables");
      return NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
    }

    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

    const publicPages = ["/", "/auth", "/api"];
    const isPublicPage = publicPages.some(page =>
      request.nextUrl.pathname.startsWith(page)
    );

    if (!user && !isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // Return a response instead of crashing
    return NextResponse.next({
      request: {
        headers: new Headers({}),
      },
    });
  }
}
