"use client";
import { FormEvent, useState } from "react";
import { requestEmailNotification } from "@/lib/notify";
export default function ReplyBox({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState(""); const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setSending(true); setError(""); const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, body }) }); const result = await response.json(); if (!response.ok) { setError(result.error || "Your reply could not be sent."); setSending(false); } else { await requestEmailNotification("message", result.messageId); window.location.reload(); } }
  return <form className="reply-box" onSubmit={submit}><input value={body} onChange={(e) => setBody(e.target.value)} required maxLength={2000} placeholder="Write a reply..." /><button className="button button-small" disabled={sending}>{sending ? "Sending" : "Send"}</button>{error && <span className="form-message error">{error}</span>}</form>;
}
