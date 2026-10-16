"use client";

import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { getPasswordRequirements, isPasswordPolicyError } from "@/lib/password-requirements";
import { trackFunnel } from "@/lib/funnel";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAE9Of1xQX12K2g2T";
type Mode = "signin" | "signup" | "recover";
type WidgetSize = "normal" | "compact";
type TurnstileApi = {
  render: (container: HTMLElement, options: {
    sitekey: string; callback: (token: string) => void;
    "expired-callback": () => void; "error-callback": () => void;
    theme: "light"; size: WidgetSize;
  }) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi; } }

export default function LoginForm({ nextPath, emailVerified = false, confirmationError, memberAccess = false, googleEnabled = false }: {
  nextPath: string; emailVerified?: boolean; confirmationError?: string; memberAccess?: boolean; googleEnabled?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(confirmationError || "");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [canResendConfirmation, setCanResendConfirmation] = useState(Boolean(confirmationError));
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const widgetSize = useRef<WidgetSize | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const autoSignInAttempted = useRef(false);
  const passwordRequirements = getPasswordRequirements(password);

  function renderTurnstile() {
    const container = turnstileContainer.current;
    if (!container || !window.turnstile) return;
    const size: WidgetSize = container.clientWidth < 300 ? "compact" : "normal";
    if (turnstileWidgetId.current) {
      if (widgetSize.current === size) return;
      window.turnstile.remove(turnstileWidgetId.current);
      turnstileWidgetId.current = null;
      setCaptchaToken("");
    }
    widgetSize.current = size;
    turnstileWidgetId.current = window.turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY, theme: "light", size,
      callback: setCaptchaToken,
      "expired-callback": () => setCaptchaToken(""),
      "error-callback": () => {
        setCaptchaToken(""); setMessageType("error");
        setMessage("The human check could not finish. Check your connection, then refresh this page and try again.");
      },
    });
  }
  function resetCaptcha() {
    setCaptchaToken("");
    if (turnstileWidgetId.current && window.turnstile) window.turnstile.reset(turnstileWidgetId.current);
  }
  useEffect(() => {
    renderTurnstile();
    const observer = new ResizeObserver(() => renderTurnstile());
    if (turnstileContainer.current) observer.observe(turnstileContainer.current);
    return () => {
      observer.disconnect();
      if (turnstileWidgetId.current && window.turnstile) window.turnstile.remove(turnstileWidgetId.current);
      turnstileWidgetId.current = null;
    };
  }, []);
  useEffect(() => {
    if (message || waitingForVerification) statusRef.current?.focus();
  }, [message, waitingForVerification]);

  useEffect(() => {
    // Only the completed human check triggers automatic sign-in. Keep retries
    // explicit so a failed password cannot cause a verification/retry loop.
    if (!captchaToken || mode !== "signin" || loading || waitingForVerification || canResendConfirmation || autoSignInAttempted.current) return;
    const form = formRef.current;
    const fields = form ? new FormData(form) : null;
    if (!form || !fields?.get("email") || !fields.get("password") || !form.checkValidity()) return;
    autoSignInAttempted.current = true;
    form.requestSubmit();
  }, [captchaToken, mode, loading, waitingForVerification, canResendConfirmation]);

  function changeMode(nextMode: Mode) {
    if (loading) return;
    if (nextMode === "signup") trackFunnel("signup_open");
    setMode(nextMode); setMessage(""); setMessageType("error"); setPassword(""); setShowPassword(false);
    setWaitingForVerification(false); setCanResendConfirmation(false); resetCaptcha();
  }
  async function googleSignIn() {
    if (loading || !googleEnabled) return;
    autoSignInAttempted.current = true;
    setLoading(true); setMessage(""); setMessageType("error");
    try {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
      });
      if (!error) return;
    } catch { /* Preserve email sign-in as a fallback. */ }
    setLoading(false);
    setMessage("Could not connect to Google. Try again or continue with email.");
  }
  async function resendConfirmation() {
    if (loading) return;
    setMessageType("error"); setMessage("");
    if (!email.trim()) { setMessage("Enter the email address you used to create your APG account."); return; }
    if (!captchaToken) { setMessage("Complete the human check below, then tap Resend verification email."); return; }
    setLoading(true);
    try {
      const { error } = await createClient().auth.resend({ type: "signup", email: email.trim(), options: {
        captchaToken, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      } });
      if (error) setMessage(error.message);
      else {
        setWaitingForVerification(true); setMessageType("success");
        setMessage("Verification email requested. Check your inbox and spam folder, and use the newest link. If you already confirmed this email, return to Sign in instead.");
      }
    } catch { setMessage("We could not reach APG. Check your connection and try again."); }
    finally { resetCaptcha(); setLoading(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (loading || waitingForVerification) return;
    if (mode === "signin") autoSignInAttempted.current = true;
    setMessage(""); setMessageType("error");
    if (mode === "signup") trackFunnel("signup_submit");
    if (!hasSupabaseConfig()) { setMessage("APG is temporarily unavailable. Please try again shortly."); return; }
    if (mode === "signup" && !passwordRequirements.every(item => item.met)) {
      trackFunnel("signup_error");
      setMessage("Your password needs at least 8 characters, uppercase and lowercase letters, a number and a symbol. Check the list above, then try again.");
      return;
    }
    if (!captchaToken) {
      if (mode === "signup") trackFunnel("signup_error");
      setMessage("Complete the human check, then tap the button to continue."); return;
    }
    setLoading(true);
    let navigating = false;
    try {
      const supabase = createClient();
      if (mode === "recover") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery&next=/reset-password`, captchaToken,
        });
        if (error) setMessage("The reset email could not be sent. Please wait a moment and try again.");
        else { setMessageType("success"); setMessage("If an APG account uses that email, a password-reset link is on its way. Check your inbox and spam folder."); }
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: {
          captchaToken, data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        } });
        if (error) { trackFunnel("signup_error"); setMessage(isPasswordPolicyError(error.message) ? "Your password needs at least 8 characters, uppercase and lowercase letters, a number and a symbol. Update it using the checklist above." : error.message); }
        else if (data.session) {
          trackFunnel("signup_accepted"); navigating = true; window.location.assign(nextPath);
        } else {
          trackFunnel("signup_accepted"); setPassword(""); setShowPassword(false);
          setWaitingForVerification(true);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password, options: { captchaToken } });
        if (error) {
          trackFunnel("signin_error");
          const unconfirmed = error.code === "email_not_confirmed" || /email(?: address)? not confirmed/i.test(error.message);
          setCanResendConfirmation(unconfirmed);
          setMessage(unconfirmed
            ? "Your email is not confirmed yet. Open the APG verification email and tap its link. Need a new email? Complete the human check again, then tap Resend verification email."
            : error.message);
        } else if (data.session) { navigating = true; window.location.assign(nextPath); }
        else setMessage("Sign-in did not finish. Please try again.");
      }
    } catch {
      trackFunnel(mode === "signup" ? "signup_error" : "signin_error");
      setMessage("We could not reach APG. Check your connection and try again. Your entries are still here.");
    } finally { if (!navigating) { resetCaptcha(); setLoading(false); } }
  }

  const heading = waitingForVerification ? "Check your email" : mode === "signup" ? "Create your account" : mode === "recover" ? "Reset your password" : emailVerified ? "Email confirmed — sign in" : "Sign in";
  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={renderTurnstile} onError={() => { setMessageType("error"); setMessage("The human check could not load. Check your connection and refresh this page."); }} />
    <h1>{heading}</h1>
    {!waitingForVerification && <p className="login-description">{mode === "signup" ? "Join the Any Part & Gear marketplace." : mode === "recover" ? "Enter your account email and we’ll send you a reset link." : memberAccess ? "Sign in or create an account to post, message sellers and use member features." : "Welcome back to Any Part & Gear."}</p>}
    {!waitingForVerification && mode !== "recover" && googleEnabled && <div className="login-social-options">
      <button className="login-social-button" type="button" disabled={loading} onClick={googleSignIn}>Continue with Google</button>
      <p className="login-email-divider">or continue with email</p>
    </div>}
    <form ref={formRef} className="login-form" onSubmit={submit} aria-busy={loading}>
      {waitingForVerification && <div className="verification-panel" ref={statusRef} tabIndex={-1} role="status">
        <strong>One more step: confirm your email.</strong>
        <p>Check the inbox for <strong>{email.trim()}</strong>. You are not signed in yet.</p>
        <ol><li>Open the APG verification email (check spam or junk too).</li><li>Tap the confirmation link to finish verification.</li><li>If APG asks you to sign in, use your email and password.</li></ol>
        <p>Already registered with this email? Sign in, or reset your password instead of creating another account.</p>
        <button className="button" type="button" disabled={loading} onClick={() => changeMode("signin")}>Return to sign in</button>
        <button className="text-button" type="button" disabled={loading} onClick={() => changeMode("signup")}>Wrong email? Change it</button>
      </div>}
      {!waitingForVerification && <>
        {mode === "signup" && <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></div>}
        <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" autoCapitalize="none" spellCheck={false} /></div>
        {mode !== "recover" && <div className="field"><div className="login-password-label"><label htmlFor="password">Password</label>{mode === "signin" && <button className="text-button" type="button" disabled={loading} onClick={() => changeMode("recover")}>Forgot password?</button>}</div><div className="login-password"><input id="password" name="password" type={showPassword ? "text" : "password"} minLength={mode === "signup" ? 8 : undefined} required value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} aria-describedby={mode === "signup" ? "password-help" : undefined}/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>{mode === "signup" && <div id="password-help" className="password-help"><p className="sr-only">Your password must include:</p><ul className="password-requirements password-requirements-compact">{passwordRequirements.map(item => <li key={item.label} className={item.met ? "met" : ""}><span aria-hidden="true">{item.met ? "✓" : "○"}</span><span>{({ "At least 8 characters": "8+ characters", "A lowercase letter (a–z)": "Lowercase", "An uppercase letter (A–Z)": "Uppercase", "A number (0–9)": "Number", "A symbol (for example !, @ or #)": "Symbol (!, @, #)" } as Record<string, string>)[item.label] ?? item.label}<span className="sr-only">{item.met ? " — included" : " — still needed"}</span></span></li>)}</ul></div>}</div>}
      </>}
      <section className="login-security" aria-label={waitingForVerification ? "Verification email resend check" : "Human verification"}>
        {waitingForVerification && <p className="login-security-help">Complete the check to resend your confirmation email.</p>}
        <div className="login-captcha" ref={turnstileContainer}/>
        <p className="sr-only" role="status" aria-live="polite">{captchaToken ? "Human verification complete." : "Waiting for human verification."}</p>
      </section>
      {emailVerified && mode === "signin" && !message && !waitingForVerification && <p className="form-message success">Your email is confirmed. Enter your password and sign in to continue.</p>}
      {message && <div ref={waitingForVerification ? undefined : statusRef} tabIndex={-1} role={messageType === "error" ? "alert" : "status"} className={`form-message login-result ${messageType}`}>{message}</div>}
      {waitingForVerification ? <button className="button" type="button" disabled={loading || !captchaToken} onClick={resendConfirmation}>{loading ? "Requesting email…" : "Resend verification email"}</button> : <button className="button" type="submit" disabled={loading || !captchaToken}>{loading ? mode === "signin" ? "Signing you in…" : mode === "signup" ? "Creating account…" : "Requesting email…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Email me a reset link"}</button>}
      {mode === "signin" && canResendConfirmation && !waitingForVerification && <button className="text-button" type="button" disabled={loading || !captchaToken} onClick={resendConfirmation}>Resend verification email</button>}
      {(mode === "recover" || waitingForVerification) && <button className="text-button" type="button" disabled={loading} onClick={() => changeMode(waitingForVerification ? "recover" : "signin")}>{waitingForVerification ? "Reset password for an existing account" : "Back to sign in"}</button>}
      {mode === "signup" && !waitingForVerification && <p className="login-confirmation-hint">We’ll email you a link to confirm your account.</p>}
      {!waitingForVerification && mode !== "recover" && <p className="login-account-switch">{mode === "signup" ? "Already a member?" : "New to APG?"} <button className="text-button" type="button" disabled={loading} onClick={() => changeMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Sign in" : "Create account"}</button></p>}
      <p className="legal-note">Protected by Cloudflare Turnstile. By continuing, you agree to use APG safely and honestly.</p>
    </form>
  </>;
}
