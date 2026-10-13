export const funnelEvents = ["visit", "sell_intent", "contact_intent", "signup_open", "signup_submit", "signup_accepted", "signup_error", "signin_error"] as const;
export type FunnelEvent = typeof funnelEvents[number];
export const trafficSources = ["facebook", "instagram", "search", "direct", "other"] as const;
export type TrafficSource = typeof trafficSources[number];

export function sourceBucket(referrer: string, campaign: string, origin: string): TrafficSource {
  if (/^(facebook|fb)$/i.test(campaign)) return "facebook";
  if (/^(instagram|ig)$/i.test(campaign)) return "instagram";
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host === "facebook.com" || host.endsWith(".facebook.com")) return "facebook";
    if (host === "instagram.com" || host.endsWith(".instagram.com")) return "instagram";
    if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(host)) return "search";
    return url.origin === origin ? "direct" : "other";
  } catch { return "direct"; }
}

let pending: Promise<unknown> = Promise.resolve();
export function trackFunnel(event: FunnelEvent) {
  if (typeof window === "undefined" || navigator.webdriver) return;
  let source: TrafficSource = sourceBucket(document.referrer, new URLSearchParams(window.location.search).get("utm_source") || "", window.location.origin);
  try {
    const saved = sessionStorage.getItem("apg-source");
    if (trafficSources.includes(saved as TrafficSource)) source = saved as TrafficSource;
    else sessionStorage.setItem("apg-source", source);
  } catch { /* Tracking must never block marketplace use. */ }
  pending = pending.then(() => fetch("/api/funnel", { method: "POST", credentials: "same-origin", keepalive: true,
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, source }) })).catch(() => {});
}
