import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/site-header";
import JobForm from "../job-form";
export default async function NewJobPage() {
  const user = await getUser(); if (!user) redirect("/login?next=/jobs/new");
  const supabase = await createClient(); const { data: shop } = await supabase.from("shops").select("id,name").eq("owner_id", user.id).eq("is_active", true).maybeSingle();
  return <main className="min-h-screen bg-[#eef1f4]"><SiteHeader signedIn/><div className="shell page-shell max-w-3xl"><Link className="font-bold underline" href={shop ? `/shops/${shop.id}?tab=jobs` : "/jobs"}>← Back</Link>{shop ? <><p className="kicker mt-6">{shop.name}</p><h1 className="page-title">Post a Job</h1><JobForm/></> : <div className="empty-state"><h1 className="page-title">Register your business first</h1><p>Only businesses with an active APG profile can post job openings.</p><Link className="button mt-5" href="/shops/register">Register Your Business</Link></div>}</div></main>;
}
