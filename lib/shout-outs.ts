export type ShoutOut = { id: string; name: string; description: string; website_url: string; image_url: string | null; status: "draft" | "published" | "archived"; updated_at: string };
export function safeShoutOutUrl(value: string | null | undefined) {
  if (!value) return null;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
