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

export default function LoginForm({ nextPath, emailVerified = false, confirmationError, memberAccess = false }: {
  nextPath: string; emailVerified?: boolean; confirmationError?: string; memberAccess?: boolean;
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

  function changeMode(nextMode: Mode) {
    if (loading) return;
    if (nextMode === "signup") trackFunnel("signup_open");
    setMode(nextMode); setMessage(""); setMessageType("error"); setPassword(""); setShowPassword(false);
    setWaitingForVerification(false); setCanResendConfirmation(false); resetCaptcha();
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

  const heading = waitingForVerification ? "Check your email" : mode === "signup" ? "Create your APG account" : mode === "recover" ? "Reset your password" : emailVerified ? "Email confirmed — sign in" : "Sign in to APG";
  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={renderTurnstile} onError={() => { setMessageType("error"); setMessage("The human check could not load. Check your connection and refresh this page."); }} />
    <h1>{heading}</h1>
    {!waitingForVerification && <p className="login-description">{mode === "signup" ? "Create an account, confirm your email, then explore APG." : mode === "recover" ? "Enter your account email and we’ll send you a reset link." : memberAccess ? "Sign in or create an account to access the marketplace, Directory and Toolbox." : "Access your marketplace, Directory, Toolbox and APG resources."}</p>}
    {!waitingForVerification && mode !== "recover" && <div className="login-mode-switch" aria-label="Account options">
      <button type="button" aria-pressed={mode === "signin"} disabled={loading} onClick={() => changeMode("signin")}>Sign in</button>
      <button type="button" aria-pressed={mode === "signup"} disabled={loading} onClick={() => changeMode("signup")}>Create account</button>
    </div>}
    <form className="login-form" onSubmit={submit} aria-busy={loading}>
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
        {mode !== "recover" && <div className="field"><label htmlFor="password">Password</label><div className="login-password"><input id="password" name="password" type={showPassword ? "text" : "password"} minLength={mode === "signup" ? 8 : undefined} required value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} aria-describedby={mode === "signup" ? "password-help" : undefined}/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>{mode === "signup" && <div id="password-help" className="password-help"><p>Your password must include:</p><ul className="password-requirements">{passwordRequirements.map(item => <li key={item.label} className={item.met ? "met" : ""}><span aria-hidden="true">{item.met ? "✓" : "○"}</span><span>{item.label}<span className="sr-only">{item.met ? " — included" : " — still needed"}</span></span></li>)}</ul></div>}</div>}
      </>}
      <section className="login-security" aria-label={waitingForVerification ? "Verification email resend check" : "Human verification"}>
        <p className="login-security-label"><strong>{waitingForVerification ? "Need another verification email?" : "Human check"}</strong></p>
        <p className="login-security-help">{waitingForVerification ? "Complete this check, then tap Resend verification email." : mode === "signup" ? "A “Success” here only completes this check. Tap Create account below to submit your details." : "This check confirms you’re human. Use the button below to finish."}</p>
        <div className="login-captcha" ref={turnstileContainer}/>
        <p className="login-security-status" role="status" aria-live="polite">{captchaToken ? waitingForVerification ? "Human check complete. You can request another email below." : mode === "signup" ? "Human check complete. Your account has not been submitted yet." : "Human check complete. You can continue below." : "Waiting for human verification…"}</p>
      </section>
      {emailVerified && mode === "signin" && !message && !waitingForVerification && <p className="form-message success">Your email is confirmed. Enter your password and sign in to continue.</p>}
      {message && <div ref={waitingForVerification ? undefined : statusRef} tabIndex={-1} role={messageType === "error" ? "alert" : "status"} className={`form-message login-result ${messageType}`}>{message}</div>}
      {waitingForVerification ? <button className="button" type="button" disabled={loading || !captchaToken} onClick={resendConfirmation}>{loading ? "Requesting email…" : "Resend verification email"}</button> : <button className="button" type="submit" disabled={loading || !captchaToken}>{loading ? mode === "signin" ? "Signing you in…" : mode === "signup" ? "Creating account…" : "Requesting email…" : mode === "signin" ? "Sign in to APG" : mode === "signup" ? "Create account" : "Email me a reset link"}</button>}
      {mode === "signin" && !waitingForVerification && <button className="text-button" type="button" disabled={loading} onClick={() => changeMode("recover")}>Forgot your password?</button>}
      {mode === "signin" && canResendConfirmation && !waitingForVerification && <button className="text-button" type="button" disabled={loading || !captchaToken} onClick={resendConfirmation}>Resend verification email</button>}
      {(mode === "recover" || waitingForVerification) && <button className="text-button" type="button" disabled={loading} onClick={() => changeMode(waitingForVerification ? "recover" : "signin")}>{waitingForVerification ? "Reset password for an existing account" : "Back to sign in"}</button>}
      <p className="legal-note">Protected by Cloudflare Turnstile. By continuing, you agree to use Anypart &amp; Gear safely and honestly. Sellers control payment, pickup and delivery.</p>
    </form>
  </>;
}
