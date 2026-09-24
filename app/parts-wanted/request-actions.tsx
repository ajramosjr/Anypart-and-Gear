"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function BusinessResponseForm({ requestId, shopId, userId }: { requestId: string; shopId: string; userId: string }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const responseId = crypto.randomUUID();
    const priceValue = String(form.get("price") || "").trim();
    const { error } = await createClient().from("part_request_responses").insert({
      id: responseId,
      request_id: requestId,
      shop_id: shopId,
      responder_id: userId,
      availability: String(form.get("availability") || ""),
      message: String(form.get("message") || "").trim(),
      price: priceValue ? Number(priceValue) : null,
    });
    if (error) {
      setMessage(error.code === "23505" ? "Your business already responded to this request." : error.message);
      setSaving(false);
      return;
    }
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "part_request_response", entityId: responseId }),
    }).catch(() => null);
    window.location.reload();
  }

  return <form className="business-response-form" onSubmit={submit}>
    <h2>Respond as a verified business</h2>
    <p>Let the requester know what you have or ask for another detail. Their contact information stays private.</p>
    <div className="form-grid">
      <div className="field"><label htmlFor="availability">Availability</label><select id="availability" name="availability" defaultValue="In stock"><option>In stock</option><option>Can source it</option><option>Need more information</option></select></div>
      <div className="field"><label htmlFor="price">Estimated price (optional)</label><input id="price" name="price" type="number" min="0" step="0.01" placeholder="0.00" /></div>
      <div className="field full"><label htmlFor="response-message">Message</label><textarea id="response-message" name="message" minLength={10} maxLength={1200} required placeholder="Tell the requester what you have, its condition, or what detail you need." /></div>
    </div>
    <div className="form-actions"><button className="button" disabled={saving}>{saving ? "Sending..." : "Send response"}</button>{message && <span className="form-message error">{message}</span>}</div>
  </form>;
}

export function ContactRespondingShop({ shopId, requestLabel }: { shopId: string; requestLabel: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function contact() {
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shopId, body: `I'm following up on my Parts Wanted request: ${requestLabel}` }) });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "The conversation could not be opened.");
      setBusy(false);
      return;
    }
    router.push(`/messages?chat=${result.conversationId}`);
  }

  return <div><button className="button button-small" type="button" onClick={contact} disabled={busy}>{busy ? "Opening..." : "Message business"}</button>{message && <small className="form-message error">{message}</small>}</div>;
}

export function ClosePartRequest({ requestId, status }: { requestId: string; status: string }) {
  const [busy, setBusy] = useState(false);

  async function update(nextStatus: "fulfilled" | "closed") {
    setBusy(true);
    const { error } = await createClient().from("part_requests").update({ status: nextStatus }).eq("id", requestId);
    if (error) {
      alert("The request could not be updated.");
      setBusy(false);
      return;
    }
    window.location.reload();
  }

  if (status !== "active") return null;
  return <div className="request-owner-actions"><button className="button button-small" disabled={busy} onClick={() => update("fulfilled")}>Mark as found</button><button className="button button-small button-secondary" disabled={busy} onClick={() => update("closed")}>Close request</button></div>;
}
