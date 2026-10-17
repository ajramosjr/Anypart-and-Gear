import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { jobFields, jobSchedules, type Job } from "@/lib/jobs";
import JobCard from "./job-card";
export const dynamic = "force-dynamic";
export const metadata = { title: "Jobs & Opportunities | APG" };
export default async function JobsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams; const field = typeof params.field === "string" ? params.field : ""; const location = typeof params.location === "string" ? params.location.slice(0, 120) : ""; const schedule = typeof params.schedule === "string" ? params.schedule : "";
  const supabase = await createClient(); const user = await getUser();
  const { data: shop } = user ? await supabase.from("shops").select("id").eq("owner_id", user.id).eq("is_active", true).maybeSingle() : { data: null };
  let query = supabase.from("jobs").select("*,shops!inner(name,is_active)").eq("shops.is_active", true).eq("status", "open").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(100);
  if (jobFields.includes(field)) query = query.eq("field", field);
  if (jobSchedules.includes(schedule)) query = query.eq("schedule", schedule);
  if (location) query = query.ilike("location", `%${location.replace(/[\\%_]/g, "\\$&")}%`);
  const { data, error } = await query;
  return <main className="min-h-screen bg-[#eef1f4]"><SiteHeader signedIn={!!user}/><div className="shell page-shell"><Link href="/marketplace" className="font-bold underline">← Marketplace</Link><div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><span className="kicker">Find your next opportunity</span><h1 className="page-title">Jobs &amp; Opportunities</h1><p className="mt-2 text-slate-600">Openings from businesses on APG. Apply directly to the employer.</p></div>{shop && <Link className="button" href="/jobs/new">Post a Job</Link>}</div>
    <form className="my-7 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-4"><label className="grid gap-1 font-bold">Field<select name="field" className="rounded-lg border p-3" defaultValue={field}><option value="">All fields</option>{jobFields.map(value => <option key={value}>{value}</option>)}</select></label><label className="grid gap-1 font-bold">Schedule<select name="schedule" className="rounded-lg border p-3" defaultValue={schedule}><option value="">All schedules</option>{jobSchedules.map(value => <option key={value}>{value}</option>)}</select></label><label className="grid gap-1 font-bold">Location<input name="location" maxLength={120} className="rounded-lg border p-3" defaultValue={location} placeholder="City or state"/></label><button className="button self-end">Find Jobs</button></form>
    {error ? <div role="alert" className="empty-state">Job openings could not be loaded. Please try again shortly.</div> : data?.length ? <div className="grid gap-5 md:grid-cols-2">{(data as Job[]).map(job => <JobCard job={job} key={job.id} signedIn={!!user}/>)}</div> : <div className="empty-state"><h2>No openings found</h2><p>Try another location or check back as businesses add openings.</p></div>}
  </div></main>;
}
