"use client";

import { FormEvent, useEffect, useState } from "react";
import { getPasswordRequirements, isPasswordPolicyError } from "@/lib/password-requirements";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    const checkSession = async () => {
      try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted) return;
      setReady(Boolean(session) && !error);
      if (!session || error) setMessage("This reset link is invalid or has expired. Request a new link from the sign-in page.");
      } catch { if (mounted) setMessage("We could not check your reset link. Check your connection and refresh the page."); }
    };
    void checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted && event === "PASSWORD_RECOVERY" && session) { setReady(true); setMessage(""); }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!ready || loading) return;
    if (!getPasswordRequirements(password).every(item => item.met)) {
      setMessage("Use at least 8 characters, uppercase and lowercase letters, a number and a symbol.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage(isPasswordPolicyError(error.message) ? "Use at least 8 characters, uppercase and lowercase letters, a number and a symbol." : error.message.includes("session") ? "This reset link is invalid or has expired. Request a new link from the sign-in page." : error.message);
        return;
      }
      setPassword(""); setConfirmPassword("");
      await supabase.auth.signOut({ scope: "local" }).catch(() => null);
      setComplete(true);
    } catch { setMessage("We could not save your password. Check your connection and try again."); }
    finally { setLoading(false); }
  }

  if (complete) return <div role="status"><p>Your password has been changed. Sign in with your new password.</p><Link className="button" href="/login">Sign in</Link></div>;

  return (
    <form className="login-form" onSubmit={submit}>
      <div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></div>
      <div className="password-help"><p>Your password must include:</p><ul className="password-requirements">{getPasswordRequirements(password).map(item => <li key={item.label} className={item.met ? "met" : ""}><span aria-hidden="true">{item.met ? "✓" : "○"}</span>{item.label}</li>)}</ul></div>
      <div className="field"><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></div>
      {message && <p className="form-message error" role="alert">{message}</p>}
      <button className="button" disabled={loading || !ready}>{loading ? "Saving..." : "Save new password"}</button>
      <Link className="text-button" href="/login">Back to sign in</Link>
    </form>
  );
}
