"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { requestEmailNotification } from "@/lib/notify";
export default function ReplyBox({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const [body, setBody] = useState(""); const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setSending(true); setError(""); const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId, body }) }); const result = await response.json(); if (!response.ok) { setError(result.error || "Your reply could not be sent."); setSending(false); } else { setBody(""); setSending(false); router.refresh(); void requestEmailNotification("message", result.messageId); } }
  return <form className="reply-box" onSubmit={submit}><textarea rows={1} value={body} onChange={(e) => setBody(e.target.value)} required maxLength={2000} aria-label="Write a reply" placeholder="Write a message..." /><button className="button button-small" disabled={sending} aria-label={sending ? "Sending message" : "Send message"}><Send size={17}/><span>{sending ? "Sending" : "Send"}</span></button>{error && <span className="form-message error">{error}</span>}</form>;
}
