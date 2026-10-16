/** Keep authentication redirects on APG, including browser URL normalization. */
export function safeNextPath(value: string | null | undefined, fallback = "/") {
  if (!value?.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(value)) return fallback;
  try {
    const target = new URL(value, "https://www.anypartandgear.com");
    return target.origin === "https://www.anypartandgear.com" ? target.pathname + target.search + target.hash : fallback;
  } catch { return fallback; }
}
