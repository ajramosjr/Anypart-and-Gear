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
    <main className="login-page login-page-clean">
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-header-row"><Link href="/" className="login-brand login-card-brand" aria-label="Any-Part and Gear home">
            <Image src="/apg-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} className="login-brand-logo" priority />
          </Link><div className="auth-page-menu"><PageMenu /></div></div>
          <Link href="/marketplace" className="login-back-link">← Back to marketplace</Link>
          <LoginForm googleEnabled={googleEnabled} nextPath={safeNext} emailVerified={verified === "1"} confirmationError={confirmationError} memberAccess={access === "members"} />
        </div>
      </div>
      <style>{`
        .login-page-clean { padding: 24px 16px; }
        .login-page-clean .login-card { padding: 24px; }
        .login-page-clean .login-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
        .login-page-clean .login-card-brand { width: auto; margin: 0; flex: 0 1 auto; min-width: 0; }
        .login-page-clean .login-brand-logo { width: 145px; height: auto; max-width: 100%; }
        .login-page-clean .auth-page-menu { margin: 0; }
        .login-page-clean .auth-page-menu .apg-header-gear { display: none !important; }
        .login-page-clean .apg-page-menu > summary { min-height: 40px; padding: 8px 12px; font-size: 13px; }
        .login-page-clean .login-back-link { display: inline-flex; align-items: center; min-height: 44px; margin: 0 0 12px; font-size: 13px; }
        .login-page-clean .login-card h1 { font-size: 26px; }
        .login-page-clean .login-description { font-size: 14px; }
        .login-page-clean .login-social-options { margin-top: 18px; gap: 8px; }
        .login-page.login-page-clean .login-card .login-social-button { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 46px; background: #fff !important; border: 1px solid #cbd3dc !important; color: #071a35 !important; border-radius: 7px; box-shadow: none !important; }
        .login-page.login-page-clean .login-card .login-social-button::before { content: 'G'; font-family: Arial, sans-serif; font-size: 20px; font-weight: 700; background: conic-gradient(#4285f4 0deg 100deg, #34a853 100deg 180deg, #fbbc05 180deg 235deg, #ea4335 235deg 290deg, #4285f4 290deg); background-clip: text; -webkit-background-clip: text; color: transparent; }
        .login-page-clean .login-email-divider { margin: 8px 0 0; font-size: 13px; }
        .login-page-clean .login-form { margin-top: 18px; gap: 14px; }
        .login-page-clean .field { gap: 6px; }
        .login-page-clean .field input { min-height: 46px; padding: 11px 12px; font-size: 16px; }
        .login-page.login-page-clean .login-card .text-button, .login-page.login-page-clean .login-card .login-password button { background: transparent !important; color: #071a35 !important; border: 0 !important; box-shadow: none !important; border-radius: 0; font-size: 13px; min-height: 44px; }
        .login-page-clean .login-password button { padding: 0 12px; min-width: 52px; }
        .login-page-clean .login-password-label .text-button { padding: 4px 0; }
        .login-page-clean .login-account-switch { margin: 0; font-size: 14px; }
        .login-page-clean .login-security-help { font-size: 12px; }
        .login-page-clean .login-security-help:has(+ *) { margin-top: 0; }
        .login-page-clean .legal-note { margin-top: 0; font-size: 11px; }
        .login-page-clean .login-form > .button { background: #e6b944 !important; color: #071a35 !important; border: 1px solid #c79522 !important; min-height: 46px; }
        @media (max-width: 640px) { .login-page-clean { padding: 18px 16px 28px; } .login-page-clean .login-card { padding: 0; } .login-page-clean .login-header-row { margin-bottom: 12px; } }
      `}</style>
    </main>
  );
}
