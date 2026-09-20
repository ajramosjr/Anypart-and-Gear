"use client";

import { useState } from "react";
import Link from "next/link";
import { requestEmailNotification } from "@/lib/notify";

export default function ContactShop({ shopId, ownerId, currentUserId, nextPath = "/shops" }: { shopId: string; ownerId: string; currentUserId?: string; nextPath?: string }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!currentUserId) return <Link className="button button-small" href={`/login?next=${encodeURIComponent(nextPath)}`}>Sign in to message</Link>;
  if (currentUserId === ownerId) return <Link className="button button-small" href="/shops/register">Manage shop</Link>;

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    setError("");
    const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shopId, body }) });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Your message could not be sent.");
      setSending(false);
      return;
    }
    await requestEmailNotification("message", result.messageId);
    window.location.assign("/messages");
  }

  return open ? (
    <div className="mt-4 grid gap-2">
      <textarea className="min-h-24 rounded-lg border border-slate-300 p-3 text-sm" aria-label="Message to shop" placeholder="Tell the shop what part or service you need..." maxLength={2000} value={body} onChange={(event) => setBody(event.target.value)} />
      <p className="text-xs text-slate-500">Your phone number and email address remain private.</p>
      <button className="button button-small" disabled={sending || !body.trim()} onClick={send}>{sending ? "Sending..." : "Send private inquiry"}</button>
      {error && <p className="form-message error">{error}</p>}
    </div>
  ) : <button className="button button-small" onClick={() => setOpen(true)}>Message shop</button>;
}
