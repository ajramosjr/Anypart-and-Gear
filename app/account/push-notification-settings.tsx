"use client";

import { useEffect, useState } from "react";
import { BellRing, Smartphone } from "lucide-react";

type PushState = "checking" | "unsupported" | "disabled" | "enabled" | "denied";

function applicationServerKey(value: string) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  return bytes;
}

export default function PushNotificationSettings() {
  const [state, setState] = useState<PushState>("checking");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkPhone() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setState("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setState("denied");
        return;
      }
      try {
        await navigator.serviceWorker.register("/sw.js");
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setState(subscription ? "enabled" : "disabled");
      } catch {
        setState("disabled");
      }
    }
    void checkPhone();
  }, []);

  async function enable() {
    setBusy(true); setMessage("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setState(permission === "denied" ? "denied" : "disabled"); setMessage("Phone notification permission was not granted."); return; }
      const registration = await navigator.serviceWorker.ready;
      const keyResponse = await fetch("/api/push/public-key");
      const keyResult = await keyResponse.json();
      if (!keyResponse.ok) throw new Error(keyResult.error || "Phone alerts are unavailable.");
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: applicationServerKey(keyResult.publicKey) });
      const response = await fetch("/api/push/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription.toJSON()) });
      const result = await response.json();
      if (!response.ok) { await subscription.unsubscribe(); throw new Error(result.error || "Phone alerts could not be enabled."); }
      setState("enabled"); setMessage("APG message alerts are enabled on this phone.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Phone alerts could not be enabled.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true); setMessage("");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/push/subscriptions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: subscription.endpoint }) });
        await subscription.unsubscribe();
      }
      setState("disabled"); setMessage("Phone alerts are off on this device.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="notification-settings">
    <div className="notification-heading"><Smartphone size={20}/><div><h2>APG phone alerts</h2><p>Show an APG notification when a private message arrives.</p></div></div>
    {state === "unsupported" && <p className="form-message">Install APG and open it from your Home Screen to enable notifications. iPhone requires iOS 16.4 or newer.</p>}
    {state === "denied" && <p className="form-message error">Notifications are blocked. Allow them in your phone’s site or app settings, then return here.</p>}
    {(state === "enabled" || state === "disabled") && <button className="button button-small" type="button" disabled={busy} onClick={state === "enabled" ? disable : enable}><BellRing size={16}/> {busy ? "Updating…" : state === "enabled" ? "Turn off phone alerts" : "Enable APG phone alerts"}</button>}
    {state === "checking" && <p className="form-message">Checking this phone…</p>}
    {message && <p className={state === "enabled" ? "form-message success" : "form-message"}>{message}</p>}
  </section>;
}
