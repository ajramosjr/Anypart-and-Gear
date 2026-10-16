import Image from "next/image";
import Link from "next/link";
import { safeNextPath } from "@/lib/safe-next-path";
import LoginForm from "./login-form";
import { supabaseUrl, supabasePublishableKey } from "@/lib/supabase/config";

async function isGoogleEnabled(): Promise<boolean> {
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabasePublishableKey }, cache: "no-store", signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return false;
    const settings = await response.json();
    return settings.external?.google === true;
  } catch { return false; }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; verified?: string; authError?: string; access?: string }> }) {
  const { next = "/", verified, authError, access } = await searchParams;
  const safeNext = safeNextPath(next);
  const googleEnabled = await isGoogleEnabled();
  const confirmationError = authError === "expired"
    ? "That verification link has expired or was already used. Enter your email below and request a new confirmation email."
    : authError === "invalid"
      ? "We could not verify that email link. Enter your email below and request a new confirmation email."
      : undefined;
  return (
    <main className="login-page">
      <div className="login-wrap">
        <div className="login-card">
          <Link href="/" className="login-brand login-card-brand" aria-label="Any-Part and Gear home">
            <Image src="/apg-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} className="login-brand-logo" priority />
          </Link>
          <Link href="/marketplace" className="login-back-link">← Back to marketplace</Link>
          <LoginForm googleEnabled={googleEnabled} nextPath={safeNext} emailVerified={verified === "1"} confirmationError={confirmationError} memberAccess={access === "members"} />
        </div>
      </div>
    </main>
  );
}
