import Link from "next/link";
import type { Metadata } from "next";
import { Cog, Wrench, Search, Lightbulb } from "lucide-react";
import ApgLogo from "@/components/apg-logo";
import { COMMUNITY_URL, getCommunityState } from "@/lib/community";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "APG Community | Any Part & Gear", description: "A place to ask repair questions, identify parts and share projects with the APG community." };

export default async function CommunityPage() {
  const { enabled } = await getCommunityState();
  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/">Back to APG</Link></div></header>
    <div className="shell py-12 pb-32">
      <section className="overflow-hidden rounded-2xl bg-[#071a35] p-7 text-white sm:p-12">
        <div className="flex items-center gap-4"><Cog size={56} className="shrink-0 text-[#e6b944]" aria-hidden="true" /><span className="rounded-full bg-[#e6b944] px-4 py-2 text-sm font-black text-[#071a35]">{enabled ? "Now available" : "Coming Soon"}</span></div>
        <h1 className="mt-6 text-4xl font-black sm:text-6xl">APG Community</h1>
        <p className="mt-4 max-w-2xl text-xl leading-8 text-slate-200">Working together. Sharing knowledge. Keeping things moving.</p>
        <p className="mt-4 max-w-2xl leading-7 text-slate-200">{enabled ? "Join the conversation about parts, repairs and projects." : "We're getting a place ready for repair questions, part identification and project ideas. The forum isn't open yet—check back for launch."}</p>
        {enabled ? <a href={COMMUNITY_URL} className="mt-7 inline-flex min-h-12 items-center rounded-lg px-6 font-black" style={{ backgroundColor: "#e6b944", color: "#071a35" }}>Visit APG Community ↗</a> : <button disabled className="mt-7 min-h-12 cursor-not-allowed rounded-lg px-6 font-black" style={{ backgroundColor: "#e6b944", color: "#071a35" }}>Community opens soon</button>}
      </section>
      <div className="mt-7 grid gap-5 sm:grid-cols-3">{[
        { title: "Repair Questions", text: "Talk through troubleshooting, maintenance and repairs.", Icon: Wrench },
        { title: "Part Identification", text: "Share markings and photos to help identify a part.", Icon: Search },
        { title: "Projects & Tips", text: "Share what you're building and what you've learned.", Icon: Lightbulb },
      ].map(({ title, text, Icon }) => <article key={title} className="rounded-xl border border-slate-200 bg-white p-6"><Icon className="text-[#a77c16]" aria-hidden="true" /><h2 className="mt-4 text-xl font-black">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}</div>
      <Link href="/marketplace" className="mt-8 inline-block py-3 font-bold">Browse the marketplace →</Link>
    </div>
  </main>;
}
