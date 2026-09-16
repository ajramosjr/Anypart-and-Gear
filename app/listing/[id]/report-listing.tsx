"use client";

import Link from "next/link";
import { Flag, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const reasons = ["Suspected scam or fraud", "Stolen or prohibited item", "Counterfeit or misleading listing", "Unsafe or recalled item", "Harassment or inappropriate content", "Other"];

export default function ReportListing({ listingId, currentUserId, isOwner, reportable }: { listingId: string; currentUserId?: string; isOwner: boolean; reportable: boolean }) {
  const [open, setOpen] = useState(false); const [reason, setReason] = useState(reasons[0]); const [details, setDetails] = useState(""); const [status, setStatus] = useState(""); const [sending, setSending] = useState(false);
  if (isOwner || !reportable) return null;
  if (!currentUserId) return <Link href={`/login?next=/listing/${listingId}`} className="report-link"><Flag size={15}/> Sign in to report this listing</Link>;
  async function submitReport() {
    setSending(true); setStatus(""); const supabase = createClient();
    const { error } = await supabase.from("reports").insert({ reporter_id: currentUserId, listing_id: listingId, reason, details: details.trim() || null });
    if (error) { setStatus("We could not submit the report. Please try again."); setSending(false); return; }
    setStatus("Report received. Thank you for helping protect the community."); setSending(false); setDetails("");
  }
  return <div className="report-box">{open ? <div className="report-panel"><div className="report-heading"><div><strong>Report this listing</strong><p>Reports are private and reviewed for safety.</p></div><button type="button" onClick={()=>setOpen(false)} aria-label="Close report form"><X size={18}/></button></div><label htmlFor="report-reason">Reason</label><select id="report-reason" value={reason} onChange={e=>setReason(e.target.value)}>{reasons.map(item=><option key={item}>{item}</option>)}</select><label htmlFor="report-details">Details (optional)</label><textarea id="report-details" value={details} onChange={e=>setDetails(e.target.value)} maxLength={1000} placeholder="What should our safety team know?"/><button type="button" className="button detail-button" onClick={submitReport} disabled={sending}>{sending?"Submitting…":"Submit private report"}</button>{status&&<p className={status.startsWith("Report received")?"form-message success":"form-message error"}><ShieldCheck size={15}/>{status}</p>}</div>:<button type="button" className="report-link" onClick={()=>setOpen(true)}><Flag size={15}/> Report this listing</button>}</div>;
}
