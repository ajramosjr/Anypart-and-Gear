import Link from "next/link";
import type { Metadata } from "next";
import ApgLogo from "@/components/apg-logo";
import ShoutOutCard from "@/components/shout-out-card";
import { createClient } from "@/lib/supabase/server";
import type { ShoutOut } from "@/lib/shout-outs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "APG Shout-Outs | Any Part & Gear", description: "Websites, businesses and people we appreciate—and think you should check out." };

export default async function ShoutOutsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("shout_outs").select("id,name,description,website_url,image_url,status,updated_at").eq("status", "published").order("updated_at", { ascending: false });
  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/">Back to APG</Link></div></header>
    <div className="shell py-12 pb-32"><span className="kicker">Check this out</span><h1 className="mt-3 text-4xl font-black sm:text-5xl">APG Shout-Outs</h1><p className="mt-4 max-w-3xl text-xl leading-8 text-slate-600">Websites, businesses, and people we appreciate—and think you should check out.</p>
      {data?.length ? <div className="mt-8 grid gap-6 md:grid-cols-2">{(data as ShoutOut[]).map(item => <ShoutOutCard key={item.id} item={item} />)}</div> : <section className="mt-8 rounded-xl border border-slate-200 bg-white p-8"><h2 className="text-2xl font-black">{error ? "Check back shortly" : "Shout-outs are on the way"}</h2><p className="mt-3 leading-7 text-slate-600">{error ? "We couldn't load our shout-outs. Please try again shortly." : "We're putting together some favorites to share with you. Check back soon!"}</p></section>}
      <p className="mt-7 text-sm leading-6 text-slate-500">These are personal recommendations from APG. A shout-out does not imply a partnership or sponsorship.</p>
    </div>
  </main>;
}
