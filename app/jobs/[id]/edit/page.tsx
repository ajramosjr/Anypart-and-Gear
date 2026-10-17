import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/jobs";
import SiteHeader from "@/components/site-header";
import JobForm from "../../job-form";
export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const user = await getUser(); if (!user) redirect(`/login?next=${encodeURIComponent(`/jobs/${id}/edit`)}`);
  const supabase = await createClient(); const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).eq("is_active", true).eq("is_verified", true).maybeSingle(); if (!shop) notFound();
  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).eq("shop_id", shop.id).maybeSingle(); if (!job) notFound();
  return <main className="min-h-screen bg-[#eef1f4]"><SiteHeader signedIn/><div className="shell page-shell max-w-3xl"><Link href={`/shops/${shop.id}?tab=jobs`}>← Back to Your Jobs</Link><h1 className="page-title mt-5">Edit Job</h1><JobForm initial={job as Job}/></div></main>;
}
