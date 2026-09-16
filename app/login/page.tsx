import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/" } = await searchParams;
  return (
    <main className="login-page">
      <div className="login-wrap">
        <Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link>
        <div className="login-card"><h1>Welcome back</h1><p>Sign in securely to post listings, manage your account and contact sellers.</p><LoginForm nextPath={next.startsWith("/") && !next.startsWith("//") ? next : "/"} /></div>
      </div>
    </main>
  );
}
