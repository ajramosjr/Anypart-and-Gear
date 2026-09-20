"use client";

import Link from "next/link";
import { useState } from "react";
import { requestEmailNotification } from "@/lib/notify";

export default function ContactSeller({ listingId, sellerId, currentUserId, allowOffers, listingPrice }: { listingId: string; sellerId?: string; currentUserId?: string; allowOffers: boolean; listingPrice: number }) {
  const [mode, setMode] = useState<"message" | "offer" | null>(null);
  const [body, setBody] = useState("Hi, is this item still available?");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  if (!sellerId) return <Link className="button detail-button" href="/login">Sign in to contact seller</Link>;
  if (!currentUserId) return <div className="contact-actions"><Link className="button detail-button" href={`/login?next=/listing/${listingId}`}>Sign in to contact seller</Link></div>;
  if (currentUserId === sellerId) return <Link className="button detail-button" href={`/listing/${listingId}/edit`}>Edit this listing</Link>;

  async function send(payload: Record<string, unknown>) {
    setSending(true); setError("");
    const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId, ...payload }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "Your message could not be sent."); setSending(false); return; }
    await requestEmailNotification("message", result.messageId);
    window.location.assign(`/messages?chat=${result.conversationId}`);
  }

  return <div className="contact-box">
    {!mode && <div className="contact-actions">
      <button className="button detail-button" onClick={() => setMode("message")}>Message seller privately</button>
      {allowOffers && <button className="button button-ghost-dark detail-button" onClick={() => setMode("offer")}>Make an offer</button>}
    </div>}
    {mode === "message" && <div className="contact-form">
      <textarea aria-label="Message to seller" placeholder="Ask about condition, fitment, pickup or delivery..." value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} />
      <p className="contact-privacy">Your email address and phone number stay private.</p>
      <div className="contact-actions"><button className="button detail-button" onClick={() => void send({ body })} disabled={sending || !body.trim()}>{sending ? "Sending..." : "Send private message"}</button><button className="text-button" onClick={() => setMode(null)}>Cancel</button></div>
    </div>}
    {mode === "offer" && <div className="offer-form">
      <label htmlFor="offer-amount">Your offer</label>
      <div className="offer-input"><span>$</span><input id="offer-amount" type="number" min="1" max="100000000" step="0.01" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={Math.max(1, Math.round(listingPrice * .9)).toString()} /></div>
      <p>Offers are nonbinding. Payment, pickup and delivery are arranged directly with the seller.</p>
      <div className="contact-actions"><button className="button detail-button" onClick={() => void send({ messageType: "offer", amount: Number(amount) })} disabled={sending || !Number(amount)}>{sending ? "Sending..." : "Send offer"}</button><button className="text-button" onClick={() => setMode(null)}>Cancel</button></div>
    </div>}
    {error && <p className="form-message error">{error}</p>}
  </div>;
}
