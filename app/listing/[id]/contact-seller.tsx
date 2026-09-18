"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { requestEmailNotification } from "@/lib/notify";

export default function ContactSeller({ listingId, sellerId, currentUserId }: { listingId: string; sellerId?: string; currentUserId?: string }) {
  const [open, setOpen] = useState(false); const [body, setBody] = useState("Hi, is this item still available?"); const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  if (!sellerId) return <Link className="button detail-button" href="/login">Sign in to contact seller</Link>;
  if (!currentUserId) return <Link className="button detail-button" href={`/login?next=/listing/${listingId}`}>Sign in to contact seller</Link>;
  if (currentUserId === sellerId) return <Link className="button detail-button" href={`/listing/${listingId}/edit`}>Edit this listing</Link>;
  async function send() {
    setSending(true); setError(""); const supabase = createClient();
    const { data: conversation, error: conversationError } = await supabase.from("conversations").upsert({ listing_id: listingId, buyer_id: currentUserId, seller_id: sellerId }, { onConflict: "listing_id,buyer_id,seller_id" }).select("id").single();
    if (conversationError) { setError(conversationError.message); setSending(false); return; }
    const { data: message, error: messageError } = await supabase.from("messages").insert({ conversation_id: conversation.id, sender_id: currentUserId, body }).select("id").single();
    if (messageError) { setError(messageError.message); setSending(false); return; }
    await requestEmailNotification("message", message.id);
    window.location.assign("/messages");
  }
  return <div className="contact-box">{open ? <><textarea aria-label="Message to seller" placeholder="Ask about condition, fitment, pickup or delivery..." value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} /><p className="contact-privacy">Your email address and phone number stay private.</p><button className="button detail-button" onClick={send} disabled={sending || !body.trim()}>{sending ? "Sending..." : "Send private message"}</button>{error && <p className="form-message error">{error}</p>}</> : <button className="button detail-button" onClick={() => setOpen(true)}>Message seller privately</button>}</div>;
}
