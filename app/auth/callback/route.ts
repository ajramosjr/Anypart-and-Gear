import { NextResponse } from "next/server";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const providerErrorCode = url.searchParams.get("error_code");
  const providerErrorDescription = url.searchParams.get("error_description");
  const requestedNext = url.searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/";
  let exchangeErrorCode: string | undefined;
  let exchangeErrorMessage: string | undefined;
  if (code && hasSupabaseConfig()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    exchangeErrorCode = error.code;
    exchangeErrorMessage = error.message;
  }
  const loginUrl = new URL("/login", url.origin);
  const expired =
    providerErrorCode === "otp_expired" ||
    providerErrorDescription?.toLowerCase().includes("expired") ||
    exchangeErrorCode === "otp_expired" ||
    exchangeErrorMessage?.toLowerCase().includes("expired");
  loginUrl.searchParams.set("authError", expired ? "expired" : "invalid");
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}
