"use client";
import { useEffect, useState } from "react";
import { APP_VERSION } from "@/lib/app-version";
export default function AppUpdates() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let disposed = false;
    let registration: ServiceWorkerRegistration | undefined;
    let busy = false;
    async function check() {
      if (busy || document.visibilityState !== "visible") return;
      busy = true;
      try {
        await registration?.update();
        const response = await fetch("/api/app-version", {cache:"no-store"});
        if (response.ok) {
          const data = await response.json();
          if (!disposed && data.version && data.version !== APP_VERSION) setAvailable(true);
        }
      } catch { /* Keep the current page usable offline. */ }
      finally { busy = false; }
    }
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", {updateViaCache:"none"})
        .then(value => {registration=value; if(!disposed) void check();}).catch(() => {});
    }
    void check();
    document.addEventListener("visibilitychange", check);
    window.addEventListener("online", check);
    const timer = window.setInterval(check, 5 * 60 * 1000);
    return () => {disposed=true;window.clearInterval(timer);document.removeEventListener("visibilitychange", check);window.removeEventListener("online", check);};
  }, []);
  if (!available) return null;
  return <aside className="apg-update-notice" role="status"><span>An APG update is ready. Save any changes before refreshing.</span><button type="button" onClick={() => window.location.reload()}>Refresh APG</button><button type="button" aria-label="Dismiss update notice" onClick={() => setAvailable(false)}>×</button></aside>;
}
