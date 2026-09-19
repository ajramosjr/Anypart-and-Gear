import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="login-page">
      <div className="login-wrap">
        <Link href="/" className="login-brand" aria-label="Any-Part and Gear home">
          <Image src="/apg-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} className="login-brand-logo" priority />
        </Link>
        <div className="login-card">
          <h1>Choose a new password</h1>
          <p>Enter a secure password with at least eight characters.</p>
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
