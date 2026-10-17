import Link from "next/link";
import { applicationHref, type Job } from "@/lib/jobs";
import JobActions from "./job-actions";
export default function JobCard({ job, owner = false, signedIn = false }: { job: Job; owner?: boolean; signedIn?: boolean }) {
  const open = job.status === "open" && new Date(job.expires_at).getTime() > Date.now();
  const href = applicationHref(job);
  return <article id={`job-${job.id}`} className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
    <span className="text-xs font-bold uppercase tracking-wide text-amber-800">{open ? "Now Hiring" : job.status === "filled" ? "Position Filled" : "Expired"} · {job.field}</span>
    <h2 className="mt-2 text-xl font-black">{job.title}</h2>{job.shops?.name && <Link className="mt-1 inline-block font-bold text-blue-900 underline" href={`/shops/${job.shop_id}?tab=jobs`}>{job.shops.name}</Link>}
    <p className="mt-2 text-slate-600">{job.location} · {job.schedule}</p><p className="mt-2 text-lg font-bold">{job.pay_range}</p>
    <details className="mt-3"><summary className="min-h-11 cursor-pointer py-2 font-bold">View Job Details</summary><p className="whitespace-pre-wrap break-words leading-7">{job.description}</p><p className="mt-3 text-sm text-slate-600">Applications close {new Date(job.expires_at).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" })}.</p></details>
    {open && href && (signedIn ? <a className="button mt-3" href={href} target={job.application_method === "website" ? "_blank" : undefined} rel={job.application_method === "website" ? "noopener noreferrer nofollow" : undefined}>{job.application_method === "email" ? "Send Résumé" : "Apply Now"}</a> : <Link className="button mt-3" href={`/login?next=${encodeURIComponent(`/shops/${job.shop_id}?tab=jobs#job-${job.id}`)}`}>Sign In to Apply</Link>)}
    {open && <p className="mt-2 text-sm text-slate-600">Apply directly to the employer.</p>}{owner && <JobActions id={job.id} open={open}/>}
  </article>;
}
