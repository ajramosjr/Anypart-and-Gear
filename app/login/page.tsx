import PageMenu from "@/components/page-menu";
import Image from "next/image";
import Link from "next/link";
import { safeNextPath } from "@/lib/safe-next-path";
import LoginForm from "./login-form";
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; verified?: string; authError?: string; access?: string }> }) {
  const { next = "/", verified, authError, access } = await searchParams;
  const safeNext = safeNextPath(next);
  // Google branding verification is approved; email sign-in remains available.
  const googleEnabled = true;
  const confirmationError = authError === "expired"
    ? "That verification link has expired or was already used. Enter your email below and request a new confirmation email."
    : authError === "invalid"
      ? "We could not verify that email link. Enter your email below and request a new confirmation email."
      : undefined;
  return (
    <main className="login-page">
      <div className="login-wrap">
        <div className="auth-page-menu"><PageMenu /></div>
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
