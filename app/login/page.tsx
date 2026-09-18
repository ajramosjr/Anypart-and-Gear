import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; verified?: string }> }) {
  const { next = "/", verified } = await searchParams;
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return (
    <main className="login-page">
      <div className="login-wrap">
        <Link href="/" className="login-brand" aria-label="Any-Part and Gear home">
          <Image src="/apg-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} className="login-brand-logo" priority />
        </Link>
        <div className="login-card">
          <h1>{verified === "1" ? "Email verified!" : "Welcome back"}</h1>
          <p>{verified === "1" ? "Your email is confirmed. Sign in once to continue where you left off." : "Sign in securely to post listings, manage your account and contact sellers."}</p>
          <LoginForm nextPath={safeNext} emailVerified={verified === "1"} />
        </div>
      </div>
    </main>
  );
}
