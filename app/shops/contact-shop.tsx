"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContactShop({ shopId, ownerId, currentUserId }: { shopId: string; ownerId: string; currentUserId?: string }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!currentUserId) return <Link className="button button-small" href="/login?next=/shops">Sign in to message</Link>;
  if (currentUserId === ownerId) return <Link className="button button-small" href="/shops/register">Manage shop</Link>;

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    setError("");
    const supabase = createClient();
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .upsert(
        { shop_id: shopId, listing_id: null, buyer_id: currentUserId, seller_id: ownerId },
        { onConflict: "shop_id,buyer_id,seller_id" }
      )
      .select("id")
      .single();
    if (conversationError) {
      setError(conversationError.message);
      setSending(false);
      return;
    }
    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      body: body.trim(),
    });
    if (messageError) {
      setError(messageError.message);
      setSending(false);
      return;
    }
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
