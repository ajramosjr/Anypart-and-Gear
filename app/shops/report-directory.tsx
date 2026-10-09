"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const reasons = ["Broken website link", "Suspicious website or redirect", "Incorrect business details", "Business closed", "Correction or removal request", "Other"];

export default function ReportDirectory({ name, address, website, currentUserId }: { name: string; address: string; website: string; currentUserId?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  if (!currentUserId) return <Link href={`/login?next=${encodeURIComponent("/shops?q=" + name + "#long-island-directory")}`} className="mt-4 block text-sm font-bold underline">Report a problem <span className="font-normal">(sign in)</span></Link>;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true); setStatus("");
    try {
      const client = createClient();
      const { error } = await client.from("reports").insert({
        reporter_id: currentUserId,
        listing_id: null,
        reason: `Directory: ${reason}`,
        details: `Business: ${name}\nAddress: ${address}\nWebsite: ${website}\nDetails: ${details.trim()}`.slice(0, 1000),
      });
      setStatus(error ? "Could not submit. Please try again." : "Report received for APG review.");
      if (!error) setDetails("");
    } catch { setStatus("Could not submit. Please try again."); }
    finally { setSending(false); }
  }
  return <div className="mt-4 text-sm">
    <button type="button" className="font-bold underline" onClick={() => setOpen(!open)} aria-expanded={open}>Report a problem</button>
    {open && <form onSubmit={submit} className="mt-3 space-y-3 rounded-lg border border-slate-200 p-3">
      <p>Report this business or website privately to APG.</p>
      <label className="block" htmlFor={id + "-reason"}>Reason</label>
      <select id={id + "-reason"} value={reason} onChange={e => setReason(e.target.value)} className="w-full rounded border border-slate-300 p-2">{reasons.map(r => <option key={r}>{r}</option>)}</select>
      <label className="block" htmlFor={id + "-details"}>Details (optional)</label>
      <textarea id={id + "-details"} value={details} onChange={e => setDetails(e.target.value)} maxLength={500} className="w-full rounded border border-slate-300 p-2" />
      <button type="submit" disabled={sending || status === "Report received for APG review."} className="button button-small">{sending ? "Submitting…" : "Submit report"}</button>
      {status && <p role="status">{status}</p>}
    </form>}
  </div>;
}
