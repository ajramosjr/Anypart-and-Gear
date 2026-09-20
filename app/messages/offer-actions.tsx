"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestEmailNotification } from "@/lib/notify";

export default function OfferActions({ conversationId, messageId, amount, canCounter }: { conversationId: string; messageId: string; amount: number; canCounter: boolean }) {
  const router = useRouter();
  const [countering, setCountering] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function respond(messageType: "offer_accept" | "offer_decline" | "offer_counter") {
    setBusy(true); setError("");
    const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, relatedMessageId: messageId, messageType, amount: Number(counterAmount) }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "The offer response could not be sent."); setBusy(false); return; }
    void requestEmailNotification("message", result.messageId);
    setBusy(false); router.refresh();
  }

  return <div className="offer-actions">
    <button disabled={busy} onClick={() => void respond("offer_accept")}>Accept</button>
    <button disabled={busy} onClick={() => void respond("offer_decline")}>Decline</button>
    {canCounter && !countering && <button disabled={busy} onClick={() => setCountering(true)}>Counter</button>}
    {countering && <div className="counter-form"><span>$</span><input type="number" min="1" max="100000000" step=".01" inputMode="decimal" value={counterAmount} onChange={(event) => setCounterAmount(event.target.value)} aria-label="Counteroffer amount" placeholder={amount.toFixed(2)} /><button disabled={busy || !Number(counterAmount)} onClick={() => void respond("offer_counter")}>Send counter</button></div>}
    {error && <p className="form-message error">{error}</p>}
  </div>;
}
