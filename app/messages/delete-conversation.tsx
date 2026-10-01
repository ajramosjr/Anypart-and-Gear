"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteConversation({ conversationId, otherName }: { conversationId: string; otherName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm(`Remove your conversation with ${otherName} from your inbox? The other person will still have their copy. A new message will bring it back.`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/messages/conversation", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });
      if (!response.ok) throw new Error("Could not remove this conversation. Please try again.");
      router.replace("/messages");
      router.refresh();
    } catch {
      setError("Could not remove this conversation. Please try again.");
      setBusy(false);
    }
  }

  return <div className="flex flex-col"><button type="button" className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-xs font-bold text-red-800 hover:bg-red-50 disabled:opacity-60" onClick={remove} disabled={busy} aria-label={`Delete conversation with ${otherName}`}><Trash2 size={15}/><span>{busy ? "Removing…" : "Delete"}</span></button>{error && <small className="form-message error" role="alert">{error}</small>}</div>;
}
