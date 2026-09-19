"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
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
    window.location.assign("/account");
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></div>
      <div className="field"><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></div>
      {message && <p className="form-message error">{message}</p>}
      <button className="button" disabled={loading}>{loading ? "Saving..." : "Save new password"}</button>
      <Link className="text-button" href="/login">Back to sign in</Link>
    </form>
  );
}
