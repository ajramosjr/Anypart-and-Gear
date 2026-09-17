import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/" } = await searchParams;
  return (
    <main className="login-page">
      <div className="login-wrap">
        <Link href="/" className="login-brand" aria-label="Any-Part and Gear home">
          <Image src="/apg-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} className="login-brand-logo" priority />
        </Link>
        <div className="login-card"><h1>Welcome back</h1><p>Sign in securely to post listings, manage your account and contact sellers.</p><LoginForm nextPath={next.startsWith("/") && !next.startsWith("//") ? next : "/"} /></div>
      </div>
    </main>
  );
}
