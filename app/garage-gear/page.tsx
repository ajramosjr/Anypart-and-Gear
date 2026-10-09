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

const rcGear = [{"title":"RC car & truck parts","detail":"Browse replacement parts and upgrades. Match the part number, model and scale before buying.","query":"RC car truck replacement parts upgrades"},{"title":"Drone & FPV components","detail":"Browse propellers, motors, frames and other drone components. Verify model and electrical compatibility.","query":"drone FPV replacement parts components"},{"title":"RC batteries & chargers","detail":"Check battery chemistry, voltage, connectors and charger compatibility against your equipment manual.","query":"RC batteries compatible chargers"},{"title":"RC tools & maintenance","detail":"Browse hobby tool sets, hex drivers and maintenance supplies.","query":"RC hobby tools hex driver maintenance"}];

const marineGear = [
  {
    "title": "Boat wash & cleaning supplies",
    "detail": "Browse boat washes, brushes and general cleaning supplies. Check suitability for the surface you are cleaning.",
    "query": "marine boat wash cleaning supplies"
  },
  {
    "title": "Stainless-steel cleaners & polish",
    "detail": "Browse cleaners and polishes for marine stainless steel. Follow the product's surface-care instructions.",
    "query": "marine stainless steel cleaner polish"
  },
  {
    "title": "Hull & deck care",
    "detail": "Browse hull cleaners, deck cleaners and boat waxes. Choose products appropriate for your boat's finish.",
    "query": "boat hull deck cleaner marine wax"
  },
  {
    "title": "Marine fuel additives & stabilizers",
    "detail": "Browse marine fuel treatments and storage stabilizers. Match the product to your fuel type and follow your engine manufacturer's guidance and dosage instructions.",
    "query": "marine fuel additive stabilizer winter storage"
  },
  {
    "title": "Winterization supplies & kits",
    "detail": "Browse winterization supplies and kits. Requirements vary by engine and cooling system; follow your manufacturer's winterization procedure.",
    "query": "boat engine winterization supplies kit"
  },
  {
    "title": "Boat covers & storage accessories",
    "detail": "Browse covers and storage accessories. Check dimensions, fit and intended use before purchasing.",
    "query": "boat cover storage accessories"
  }
];

export default function GarageGearPage() {
  return <main className="min-h-screen bg-[#eef1f4] text-slate-950">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/marketplace">Back to marketplace</Link></div></header>
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow">New tools and gear</p>
      <h1 className="section-title mt-2">Tools &amp; Gear — Support APG</h1>
      <p className="mt-3 max-w-2xl text-slate-600">APG is a free marketplace for our community. When you shop through our affiliate links, we may earn a commission on qualifying purchases at no extra cost to you. Those commissions help cover the cost of running APG and keeping the marketplace free.</p>
      <nav aria-label="Gear categories" className="mt-6 flex flex-wrap gap-3">{["Automotive", "Marine", "Tools & Diagnostics", "Shop Supplies", "RC & Hobby"].map((category, index) => <a key={category} href={`#gear-${index}`} className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold">{category}</a>)}</nav>
      <section id="gear-2" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Tools &amp; Diagnostics</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gear.map(({ title, detail, query, icon: Icon }) => <article key={title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="mb-4 grid size-11 place-items-center rounded-lg bg-[#071a35] text-amber-400"><Icon className="size-5"/></span>
          <h2 className="font-extrabold">{title}</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{detail}</p>
          <a className="gold-button mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-black" href={amazonSearchUrl(query)} target="_blank" rel="noopener noreferrer sponsored nofollow">Shop on Amazon</a>
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query + " how to use tutorial")}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-center font-bold text-blue-900">Search tutorials on YouTube</a>
        </article>)}
      </div></section>
      <section id="gear-1" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Marine</h2><article className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">Shop gimbal-bearing tools</h3><p className="mt-2 text-sm leading-6 text-slate-600">Browse gimbal bearing pullers, installers and alignment tools on Amazon. Check each product listing for compatibility with your exact sterndrive and follow the manufacturer’s instructions.</p><a href="https://amzn.to/3VBYmKz" target="_blank" rel="noopener noreferrer sponsored nofollow" className="gold-button mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-black">View on Amazon</a><a href="https://www.youtube.com/results?search_query=gimbal+bearing+puller+installation+alignment+tool+tutorial" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-center font-bold text-blue-900">Search tutorials on YouTube</a></article><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{marineGear.map(({ title, detail, query }) => <article key={title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">{title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{detail}</p><a href={amazonSearchUrl(query)} target="_blank" rel="noopener noreferrer sponsored nofollow" className="gold-button mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-black">Browse on Amazon</a></article>)}</div></section>
      <section id="gear-0" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Automotive</h2><p className="mt-2 text-slate-600">Automotive parts will be added as we find useful options.</p></section>
      <section id="gear-3" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">Shop Supplies</h2><p className="mt-2 text-slate-600">Shop supplies will be added as we find useful options.</p></section>
      <section id="gear-4" className="scroll-mt-6 mt-8"><h2 className="text-xl font-extrabold">RC &amp; Hobby</h2><p className="mt-2 text-slate-600">Explore RC and drone supplies on Amazon, or visit <Link href="/shops?category=RC+%26+Hobby" className="font-bold text-blue-900 underline">local hobby shops</Link>.</p><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{rcGear.map(({ title, detail, query }) => <article key={title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold">{title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{detail}</p><a href={amazonSearchUrl(query)} target="_blank" rel="noopener noreferrer sponsored nofollow" className="gold-button mt-5 inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-black">Browse on Amazon</a></article>)}</div></section>
      <p className="mt-6 text-sm text-slate-600">Tutorial buttons open third-party YouTube search results. APG has not reviewed every video. Match instructions to your tool and equipment, and follow the manufacturer’s manual.</p>
      <p className="mt-6 text-sm text-slate-600"><strong>Affiliate disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Amazon controls pricing, availability, shipping and returns. <Link href="/affiliate-disclosure" className="font-bold text-blue-900 underline">How affiliate links work</Link></p>
    </div>
  </main>;
}
