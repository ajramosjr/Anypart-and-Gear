import Link from "next/link";
import Image from "next/image";
import { Anchor, Gamepad2, ArrowRight, Wrench, Drill, Search, Package, Shirt, ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/site-header";
import { getUser } from "@/lib/auth";
import { getCommunityState } from "@/lib/community";
import { amazonSearchUrl } from "@/lib/affiliate";

export const metadata = { title: "Tools & Work Gear | Any Part & Gear", description: "Explore tools, diagnostics, workwear, marine supplies and hobby gear with APG." };

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


const categories = [
  { id: "hand-tools", title: "Hand Tools", icon: Wrench, query: "mechanics tool set automotive", detail: "Explore sockets, ratchets and hand tools for everyday repairs.", tile: 0 },
  { id: "power-tools", title: "Power Tools", icon: Drill, query: "cordless power tools drill", detail: "Compare cordless tools and check battery-platform compatibility.", tile: 2 },
  { id: "diagnostics", title: "Diagnostics", icon: Search, query: "automotive OBD2 scanner", detail: "Find scan tools and check coverage for your vehicle and the functions you need.", tile: 1 },
  { id: "shop-equipment", title: "Shop Equipment", icon: Package, query: "garage shop supplies tool storage", detail: "Explore tool storage and supplies for a more organized workspace.", tile: 3 },
  { id: "workwear", title: "Workwear", icon: Shirt, query: "work boots workwear", detail: "Browse work boots and clothing. Check sizing and job requirements.", tile: 4 },
  { id: "safety-gear", title: "Safety Gear", icon: ShieldCheck, query: "work gloves safety glasses", detail: "Browse gloves and eye protection. Match protection ratings to the task.", tile: 5 },
];
const positions = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%", "100% 100%"];
const linkStyle = "mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#aa7c20] bg-[#e6b844] px-5 py-3 text-center text-sm font-bold !text-[#071a35] transition hover:bg-[#d5a530] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#aa7c20]";
function CategoryArt({ tile }: { tile: number }) {
  return <div aria-hidden="true" className="aspect-square w-full rounded-lg bg-slate-100" style={{ backgroundImage: "url('/apg-gear-categories.webp')", backgroundSize: "300% 200%", backgroundPosition: positions[tile] }} />;
}
const additionalPhotoTiles: Record<string, number> = {
  "Torque wrenches": 0,
  "Portable jump starters": 1,
  "Gimbal-bearing tools": 2,
  "Boat wash & cleaning supplies": 3,
  "Stainless-steel cleaners & polish": 4,
  "Hull & deck care": 5,
  "Marine fuel additives & stabilizers": 6,
  "Winterization supplies & kits": 7,
  "Boat covers & storage accessories": 8,
  "RC car & truck parts": 9,
  "Drone & FPV components": 10,
  "RC batteries & chargers": 11,
  "RC tools & maintenance": 12
};
function AdditionalGearArt({ title }: { title: string }) {
  const tile = additionalPhotoTiles[title];
  if (tile === undefined) throw new Error("Missing gear category photo: " + title);
  return <div aria-hidden="true" className="mb-5 aspect-square w-full shrink-0 rounded-lg bg-slate-100" style={{ backgroundImage: "url('/apg-gear-marine-rc.webp')", backgroundSize: "400% 400%", backgroundPosition: `${(tile % 4) * 100 / 3}% ${Math.floor(tile / 4) * 100 / 3}%` }} />;
}
function AffiliateCard({ title, detail, query }: { title: string; detail: string; query: string }) {
  return <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5"><AdditionalGearArt title={title} /><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{detail}</p><a href={amazonSearchUrl(query)} target="_blank" rel="noopener noreferrer sponsored nofollow" className={linkStyle}>Explore on Amazon <ArrowRight size={17} aria-hidden="true" /></a></article>;
}
const filterOptions = [
  { id: "all", title: "All Gear", icon: Package },
  ...categories.map(({ id, title, icon }) => ({ id, title, icon })),
  { id: "marine", title: "Marine", icon: Anchor },
  { id: "rc-hobby", title: "RC & Hobby", icon: Gamepad2 },
];
export default async function GarageGearPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const requested = (await searchParams).category;
  const active = filterOptions.some(option => option.id === requested) ? requested as string : "all";
  const showingAll = active === "all";
  const showTools = showingAll || ["hand-tools", "power-tools", "diagnostics"].includes(active);
  const showWorkday = showingAll || ["workwear", "safety-gear"].includes(active);
  const countByCategory: Record<string, number> = { all: 19, "hand-tools": 2, "power-tools": 1, diagnostics: 1, "shop-equipment": 2, workwear: 1, "safety-gear": 1, marine: 7, "rc-hobby": 4 };

  const [user, community] = await Promise.all([getUser(), getCommunityState()]);
  return <main className="min-h-screen bg-white text-[#071a35]">
    <SiteHeader signedIn={Boolean(user)} current="gear" communityEnabled={community.enabled} />
    <section className="relative isolate overflow-hidden bg-[#071a35] text-white">
      <Image src="/apg-marketplace-hero.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-right" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071a35] via-[#071a35]/90 to-[#071a35]/25" />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">For the garage, jobsite &amp; workday</p><h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">Tools &amp; Work Gear</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">Find useful tools and gear for the garage, jobsite, and workday.</p></div>
    </section>
    <div className="border-b border-slate-200 px-4 py-4 text-center text-sm leading-6 text-slate-600">As an Amazon Associate I earn from qualifying purchases. <Link href="/affiliate-disclosure" className="font-semibold text-[#805b13] underline underline-offset-4">How affiliate links support APG</Link></div>
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
      <div id="gear-categories" className="scroll-mt-28">
        <h2 className="text-2xl font-black">Browse by category</h2>
        <p className="mt-2 text-sm text-slate-600">Choose a category to show only the gear you need.</p>
        <nav aria-label="Gear categories" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{filterOptions.map(({id,title,icon: Icon}) => <Link key={id} href={id === "all" ? "/garage-gear#gear-categories" : "/garage-gear?category=" + id + "#gear-categories"} aria-current={active === id ? "true" : undefined} className={"flex min-h-16 items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600 " + (active === id ? "border-[#071a35] bg-[#071a35] !text-white" : "border-slate-200 bg-slate-50 hover:border-[#aa7c20] hover:bg-[#fbf7ed]")}><Icon className="shrink-0 text-[#c79522]" size={23} aria-hidden="true" /><span>{title}</span></Link>)}</nav>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm"><p role="status" className="text-slate-600">Showing {countByCategory[active]} {countByCategory[active] === 1 ? "category card" : "category cards"} · <strong>{filterOptions.find(option => option.id === active)?.title}</strong></p>{!showingAll && <Link href="/garage-gear#gear-categories" className="inline-flex min-h-11 items-center font-bold underline underline-offset-4">Show all gear</Link>}</div>
      </div>
      {showTools && <section aria-labelledby="tools-title" className="mt-10"><h2 id="tools-title" className="text-3xl font-black tracking-tight sm:text-4xl">Explore tools for the job</h2><p className="mt-3 text-slate-600">Start with the task. Compare specifications and compatibility on Amazon.</p><div className="mt-6 grid gap-5 md:grid-cols-3">{[categories[0], categories[2], categories[1]].filter(item => showingAll || item.id === active).map(({id,title,detail,query,tile}) => <article key={id} id={id} className="flex scroll-mt-6 flex-col rounded-xl border border-slate-200 bg-white p-3"><CategoryArt tile={tile} /><div className="flex flex-1 flex-col px-2 pb-2 pt-5"><h3 className="text-xl font-extrabold">{title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{detail}</p><a href={amazonSearchUrl(query)} target="_blank" rel="noopener noreferrer sponsored nofollow" className={linkStyle}>Explore on Amazon <ArrowRight size={17} aria-hidden="true" /></a></div></article>)}{active === "hand-tools" && <AffiliateCard title="Torque wrenches" detail="Compare drive sizes and torque ranges against your equipment's specifications." query="automotive torque wrench" />}</div></section>}
      {showWorkday && <section aria-labelledby="workday-title" className="mt-12"><h2 id="workday-title" className="text-3xl font-black tracking-tight">Gear for the workday</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{categories.slice(4).filter(item => showingAll || item.id === active).map(({id,title,detail,query,tile}) => <article key={id} id={id} className="grid scroll-mt-6 gap-5 rounded-xl border border-slate-200 p-4 sm:grid-cols-2"><CategoryArt tile={tile} /><div className="flex flex-col justify-center"><h3 className="text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p><a href={amazonSearchUrl(query)} target="_blank" rel="noopener noreferrer sponsored nofollow" className={linkStyle}>Explore on Amazon <ArrowRight size={17} aria-hidden="true" /></a></div></article>)}</div></section>}
      {(showingAll || active === "shop-equipment") && <section id="shop-equipment" className="mt-12 scroll-mt-6" aria-labelledby="shop-title"><h2 id="shop-title" className="text-3xl font-black">Equip your workspace</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><article className="rounded-xl border border-slate-200 p-4"><CategoryArt tile={3} /><h3 className="mt-5 text-xl font-extrabold">Shop Equipment &amp; Supplies</h3><p className="mt-3 text-sm leading-6 text-slate-600">{categories[3].detail}</p><a href={amazonSearchUrl(categories[3].query)} target="_blank" rel="noopener noreferrer sponsored nofollow" className={linkStyle}>Explore on Amazon <ArrowRight size={17} aria-hidden="true" /></a></article>{showingAll && <AffiliateCard title="Torque wrenches" detail="Compare drive sizes and torque ranges against your equipment's specifications." query="automotive torque wrench" />}<AffiliateCard title="Portable jump starters" detail="Check voltage, engine-size support and the manufacturer's operating instructions." query="portable car battery jump starter" /></div></section>}
      {(showingAll || active === "workwear") && <nav aria-label="More gear" className="mt-12 flex flex-wrap gap-3"><a className={linkStyle} href={amazonSearchUrl("Carhartt workwear")} target="_blank" rel="noopener noreferrer sponsored nofollow">Carhartt on Amazon <ArrowRight size={17} aria-hidden="true" /></a><a className={linkStyle} href="https://www.carhartt.com/" target="_blank" rel="noopener noreferrer">Carhartt website ↗</a></nav>}
      {(showingAll || active === "marine") && <section id="marine" className="mt-12 scroll-mt-6" aria-labelledby="marine-title"><h2 id="marine-title" className="text-3xl font-black">Marine tools &amp; supplies</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><article className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5"><AdditionalGearArt title="Gimbal-bearing tools" /><h3 className="text-lg font-extrabold">Gimbal-bearing tools</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">Browse pullers, installers and alignment tools. Confirm compatibility with your exact sterndrive and follow the manufacturer's instructions.</p><a href="https://amzn.to/3VBYmKz" target="_blank" rel="noopener noreferrer sponsored nofollow" className={linkStyle}>View on Amazon <ArrowRight size={17} aria-hidden="true" /></a><a href="https://www.youtube.com/results?search_query=gimbal+bearing+puller+installation+alignment+tool+tutorial" target="_blank" rel="noopener noreferrer" className="mt-4 py-2 text-sm font-bold underline underline-offset-4">Search tutorials on YouTube ↗</a></article>{marineGear.map(item => <AffiliateCard key={item.title} {...item} />)}</div></section>}
      {(showingAll || active === "rc-hobby") && <section id="rc-hobby" className="mt-12 scroll-mt-6" aria-labelledby="rc-title"><h2 id="rc-title" className="text-3xl font-black">RC &amp; Hobby</h2><p className="mt-3 text-slate-600">Explore supplies on Amazon or find <Link href="/shops?category=RC+%26+Hobby" className="font-semibold underline underline-offset-4">local hobby shops</Link>.</p><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{rcGear.map(item => <AffiliateCard key={item.title} {...item} />)}</div></section>}
      <details className="mt-10 rounded-xl border border-slate-200 p-5"><summary className="cursor-pointer font-bold">Tool tutorials &amp; buying notes</summary><p className="mt-4 text-sm leading-6 text-slate-600">Tutorial links open third-party YouTube search results. APG has not reviewed every video. Match instructions to your equipment and follow the manufacturer's manual. Category photos are illustrative; Amazon listings show the actual products, specifications, prices and availability.</p><div className="mt-3 flex flex-wrap gap-3">{[{ title: "OBD-II scanners", query: "automotive OBD2 scanner" }, { title: "Mechanic's tool sets", query: "mechanics tool set automotive" }, { title: "Portable jump starters", query: "portable car battery jump starter" }, { title: "Torque wrenches", query: "automotive torque wrench" }].map(item => <a key={item.title} href={"https://www.youtube.com/results?search_query=" + encodeURIComponent(item.query + " how to use tutorial")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 px-3 text-sm font-bold">{item.title} tutorials ↗</a>)}</div></details>
      <p className="mt-8 text-sm leading-6 text-slate-500">Purchases are completed with the retailer. Amazon controls pricing, availability, shipping and returns. Affiliate commissions help cover the cost of running APG.</p>
    </div>
    <footer className="mt-8 bg-[#071a35] px-5 py-8 text-sm text-slate-300"><div className="mx-auto flex max-w-7xl flex-wrap gap-5"><strong className="mr-auto text-white">ANY PART &amp; GEAR</strong><Link href="/affiliate-disclosure">Affiliate Disclosure</Link><Link href="/marketplace">Marketplace</Link><Link href="/support">Contact &amp; Support</Link></div></footer>
  </main>;
}
