"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    if (!hasSupabaseConfig()) {
      setMessage("The marketplace database is still being connected. Please try again shortly."); setLoading(false); return;
    }
    const supabase = createClient();
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` } });
      setMessage(error ? error.message : "Account created. Check your email to confirm your address.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message); else window.location.assign(nextPath);
    }
    setLoading(false);
  }

  return (
    <form className="login-form" onSubmit={submit}>
      {mode === "signup" && <div className="field"><label htmlFor="name">Full name</label><input id="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>}
      <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></div>
      {message && <p className="form-message error">{message}</p>}
      <button className="button" disabled={loading}>{loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}</button>
      <button className="text-button" type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}>{mode === "signin" ? "New here? Create a free account" : "Already have an account? Sign in"}</button>
      <p className="legal-note">By continuing, you agree to use Anypart &amp; Gear safely and honestly. Sellers control payment, pickup and delivery.</p>
    </form>
  );
}
