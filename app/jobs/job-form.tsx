"use client";
import { useState, type FormEvent } from "react";
import { jobFields, jobSchedules, type Job } from "@/lib/jobs";

export default function JobForm({ initial }: { initial?: Job }) {
  const [method, setMethod] = useState(initial?.application_method || "email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const body = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch(initial ? `/api/jobs/${initial.id}` : "/api/jobs", { method: initial ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save job.");
      window.location.assign(`/shops/${result.shopId}?tab=jobs`);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save job."); setBusy(false); }
  }
  const input = "w-full rounded-lg border border-slate-300 bg-white p-3 text-base text-slate-900";
  return <form onSubmit={submit} className="mt-6 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
    <label className="grid gap-1 font-bold">Job title<input className={input} name="title" required minLength={3} maxLength={120} defaultValue={initial?.title}/></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-1 font-bold">Location<input className={input} name="location" required minLength={2} maxLength={120} placeholder="City, state" defaultValue={initial?.location}/></label><label className="grid gap-1 font-bold">Pay range<input className={input} name="pay_range" required maxLength={120} placeholder="$25–$35 / hour" defaultValue={initial?.pay_range}/></label><label className="grid gap-1 font-bold">Field<select className={input} name="field" defaultValue={initial?.field}>{jobFields.map(value => <option key={value}>{value}</option>)}</select></label><label className="grid gap-1 font-bold">Schedule<select className={input} name="schedule" defaultValue={initial?.schedule}>{jobSchedules.map(value => <option key={value}>{value}</option>)}</select></label></div>
    <label className="grid gap-1 font-bold">Description &amp; requirements<textarea className={input} rows={6} name="description" required minLength={20} maxLength={5000} defaultValue={initial?.description}/></label>
    <label className="grid gap-1 font-bold">How should applicants apply?<select className={input} name="application_method" value={method} onChange={event => setMethod(event.target.value as "email" | "website")}><option value="email">Send résumé by email</option><option value="website">Apply on our website</option></select></label>
    <label className="grid gap-1 font-bold">{method === "email" ? "Application email (public)" : "Application website"}<input key={method} className={input} name="application_contact" type={method === "email" ? "email" : "url"} required maxLength={300} pattern={method === "website" ? "https://.*" : undefined} placeholder={method === "email" ? "hiring@yourbusiness.com" : "https://yourbusiness.com/careers"} defaultValue={initial?.application_method === method ? initial.application_contact : ""}/></label>
    <p className="text-sm text-slate-600">Applications go directly to your business. Your opening appears on your business profile and Jobs &amp; Opportunities. New postings expire after 30 days; you can renew or mark them filled.</p>
    <div><button className="button" disabled={busy}>{busy ? "Saving…" : initial ? "Save Changes" : "Post a Job"}</button></div>{error && <p role="alert" className="text-red-700">{error}</p>}
  </form>;
}
