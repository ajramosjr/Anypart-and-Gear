import Link from "next/link";
import { Drill, Search, ShieldCheck, Wrench } from "lucide-react";
import ApgLogo from "@/components/apg-logo";
import { amazonSearchUrl } from "@/lib/affiliate";

export const metadata = { title: "Tools & Gear — Support APG | Any Part & Gear", description: "Useful new tools and gear for the garage." };

const gear = [
  { title: "OBD-II scanners", detail: "Read check-engine codes and begin diagnosing warning lights.", query: "automotive OBD2 scanner", icon: Search },
  { title: "Mechanic's tool sets", detail: "Sockets, ratchets and hand tools for common repair work.", query: "mechanics tool set automotive", icon: Wrench },
  { title: "Portable jump starters", detail: "Compact emergency power for cars, trucks and recreational vehicles.", query: "portable car battery jump starter", icon: ShieldCheck },
  { title: "Torque wrenches", detail: "Tighten wheels and components to the correct specification.", query: "automotive torque wrench", icon: Drill },
];

export default function GarageGearPage() {
  return <main className="min-h-screen bg-[#eef1f4] text-slate-950">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/marketplace">Back to marketplace</Link></div></header>
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow">New tools and gear</p>
      <h1 className="section-title mt-2">Tools &amp; Gear — Support APG</h1>
      <p className="mt-3 max-w-2xl text-slate-600">APG is a free marketplace for our community. When you shop through our affiliate links, we may earn a commission on qualifying purchases at no extra cost to you. Those commissions help cover the cost of running APG and keeping the marketplace free.</p>
      <nav aria-label="Gear categories" className="mt-6 flex flex-wrap gap-3">{["Automotive", "Marine", "Tools & Diagnostics", "Shop Supplies"].map((category, index) => <a key={category} href={`#gear-${index}`} className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold">{category}</a>)}</nav>
      <section id="gear-2" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Tools &amp; Diagnostics</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gear.map(({ title, detail, query, icon: Icon }) => <article key={title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="mb-4 grid size-11 place-items-center rounded-lg bg-[#071a35] text-amber-400"><Icon className="size-5"/></span>
          <h2 className="font-extrabold">{title}</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{detail}</p>
          <a className="gold-button mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-black" href={amazonSearchUrl(query)} target="_blank" rel="noopener noreferrer sponsored nofollow">Shop on Amazon</a>
        </article>)}
      </div></section>
      <section id="gear-1" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Marine</h2><article className="mt-4 max-w-xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">BESTOOL gimbal bearing puller, installer &amp; alignment set</h3><p className="mt-2 text-sm leading-6 text-slate-600">A combined kit for gimbal bearing removal, installation and alignment. Check the product listing for compatibility with your exact sterndrive and the manufacturer’s instructions.</p><a href="https://amzn.to/3VBYmKz" target="_blank" rel="noopener noreferrer sponsored nofollow" className="gold-button mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-black">View on Amazon</a></article></section>
      <section id="gear-0" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Automotive</h2><p className="mt-2 text-slate-600">Automotive parts will be added as we find useful options.</p></section>
      <section id="gear-3" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Shop Supplies</h2><p className="mt-2 text-slate-600">Shop supplies will be added as we find useful options.</p></section>
      <p className="mt-6 text-sm text-slate-600"><strong>Affiliate disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Amazon controls pricing, availability, shipping and returns. <Link href="/affiliate-disclosure" className="font-bold text-blue-900 underline">How affiliate links work</Link></p>
    </div>
  </main>;
}
