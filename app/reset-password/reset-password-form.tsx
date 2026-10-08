"use client";

import { FormEvent, useEffect, useState } from "react";
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
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted) return;
      setReady(Boolean(session) && !error);
      if (!session || error) setMessage("This reset link is invalid or has expired. Request a new link from the sign-in page.");
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
    if (!ready) return;
    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message.includes("session") ? "This reset link is invalid or has expired. Request a new link from the sign-in page." : error.message);
      setLoading(false);
      return;
    }
    await supabase.auth.signOut({ scope: "local" });
    setComplete(true);
    setLoading(false);
  }

  if (complete) return <div role="status"><p>Your password has been changed. Sign in with your new password.</p><Link className="button" href="/login">Sign in</Link></div>;

  return (
    <form className="login-form" onSubmit={submit}>
      <div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></div>
      <div className="field"><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></div>
      {message && <p className="form-message error">{message}</p>}
      <button className="button" disabled={loading || !ready}>{loading ? "Saving..." : "Save new password"}</button>
      <Link className="text-button" href="/login">Back to sign in</Link>
    </form>
  );
}
