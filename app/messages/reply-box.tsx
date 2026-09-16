"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function ReplyBox({ conversationId, userId }: { conversationId: string; userId: string }) {
  const [body, setBody] = useState(""); const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setSending(true); const supabase = createClient(); const { error: sendError } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: userId, body }); if (sendError) { setError(sendError.message); setSending(false); } else window.location.reload(); }
  return <form className="reply-box" onSubmit={submit}><input value={body} onChange={(e) => setBody(e.target.value)} required maxLength={2000} placeholder="Write a reply..." /><button className="button button-small" disabled={sending}>{sending ? "Sending" : "Send"}</button>{error && <span className="form-message error">{error}</span>}</form>;
}

