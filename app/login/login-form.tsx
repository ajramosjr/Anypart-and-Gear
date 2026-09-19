"use client";

import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAE9Of1xQX12K2g2T";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      theme: "auto";
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function LoginForm({ nextPath, emailVerified = false }: { nextPath: string; emailVerified?: boolean }) {
  const [mode, setMode] = useState<"signin" | "signup" | "recover">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(emailVerified ? "success" : "error");
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  function renderTurnstile() {
    if (!turnstileContainer.current || !window.turnstile || turnstileWidgetId.current) return;
    turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "auto",
      callback: setCaptchaToken,
      "expired-callback": () => setCaptchaToken(""),
      "error-callback": () => {
        setCaptchaToken("");
        setMessageType("error");
        setMessage("The security check could not load. Please refresh the page and try again.");
      },
    });
  }

  function resetCaptcha() {
    setCaptchaToken("");
    if (turnstileWidgetId.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId.current);
    }
  }

  useEffect(() => {
    renderTurnstile();
    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, []);

  function changeMode(nextMode: "signin" | "signup" | "recover") {
    setMode(nextMode);
    setMessage("");
    setWaitingForVerification(false);
    resetCaptcha();
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage(""); setMessageType("error");
    if (!hasSupabaseConfig()) {
      setMessage("The marketplace database is still being connected. Please try again shortly."); setLoading(false); return;
    }
    if (!captchaToken) {
      setMessage("Please complete the security check before continuing."); setLoading(false); return;
    }
    const supabase = createClient();
    if (mode === "recover") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        captchaToken,
      });
      if (error) {
        setMessage("The reset email could not be sent. Please wait a moment and try again.");
      } else {
        setMessageType("success");
        setMessage("If an APG account uses that email, a secure password-reset link is on its way.");
      }
    } else if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) {
        setMessage(error.message);
      } else if (data.session) {
        window.location.assign(nextPath);
        return;
      } else {
        setMessageType("success");
        setWaitingForVerification(true);
        setMessage("Account created! Check your email and tap the verification link. We will bring you back to sign in and continue.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });
      if (error) setMessage(error.message); else {
        window.location.assign(nextPath);
        return;
      }
    }
    resetCaptcha();
    setLoading(false);
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={renderTurnstile} />
      <form className="login-form" onSubmit={submit}>
        {mode === "signup" && <div className="field"><label htmlFor="name">Full name</label><input id="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>}
        <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
        {mode !== "recover" && <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></div>}
        <div ref={turnstileContainer} aria-label="Security check" />
        {emailVerified && mode === "signin" && !message && <p className="form-message success">Your email is confirmed. Sign in below to continue.</p>}
        {message && <p className={`form-message ${messageType}`}>{message}</p>}
        {waitingForVerification ? (
          <button className="button" type="button" onClick={() => changeMode("signin")}>I verified my email — Sign in</button>
        ) : (
          <button className="button" disabled={loading || !captchaToken}>{loading ? "Please wait..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Email me a reset link"}</button>
        )}
        {mode === "signin" && <button className="text-button" type="button" onClick={() => changeMode("recover")}>Forgot your password?</button>}
        <button className="text-button" type="button" onClick={() => changeMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "New here? Create a free account" : "Back to sign in"}</button>
        <p className="legal-note">Protected by Cloudflare Turnstile. By continuing, you agree to use Anypart &amp; Gear safely and honestly. Sellers control payment, pickup and delivery.</p>
      </form>
    </>
  );
}
