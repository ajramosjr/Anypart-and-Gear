"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function JobActions({ id, open }: { id: string; open: boolean }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function update(action: string) {
    setBusy(true); setError("");
    try { const response = await fetch(`/api/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); router.refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to update job."); } finally { setBusy(false); }
  }
  return <div className="mt-4"><div className="flex flex-wrap gap-3"><Link className="button button-secondary" href={`/jobs/${id}/edit`}>Edit Job</Link><button className="button button-secondary" disabled={busy} onClick={() => update(open ? "close" : "renew")}>{busy ? "Saving…" : open ? "Mark Filled" : "Renew for 30 Days"}</button></div>{error && <p role="alert" className="mt-2 text-red-700">{error}</p>}</div>;
}
