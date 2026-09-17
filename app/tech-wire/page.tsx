import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  CheckCircle2,
  ExternalLink,
  Gauge,
  Lightbulb,
  Mountain,
  Newspaper,
  Ruler,
  ShieldCheck,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "APG Tech Wire | Vehicle news and practical buying guides",
  description: "Straightforward vehicle news, practical comparisons, and ideas for drivers, families, shops, and builders.",
};

const choices = [
  {
    name: "Wrangler",
    seats: "2 rows / up to 5",
    best: "Open-air trail personality",
    verdict: "Pick it when off-road character matters more than a third row.",
    href: "https://www.jeep.com/wrangler.html",
  },
  {
    name: "Grand Cherokee L",
    seats: "3 rows / up to 7",
    best: "Family-size balance",
    verdict: "The closest factory Jeep answer for three rows without going full-size.",
    href: "https://www.jeep.com/grand-cherokee/3-row-suv.html",
  },
  {
    name: "Grand Wagoneer",
    seats: "3 rows / up to 8",
    best: "Maximum people, cargo and towing",
    verdict: "Choose it when space and heavy-duty family travel lead the list.",
    href: "https://www.jeep.com/grand-wagoneer.html",
  },
];

const wishList = [
  { icon: Users, title: "A real usable third row", copy: "Room for children or occasional adults, with safe access that does not turn every stop into a puzzle." },
  { icon: Mountain, title: "Wrangler capability", copy: "Four-wheel-drive hardware, useful clearance and the rugged personality buyers expect from the name." },
  { icon: Ruler, title: "Enough cargo behind it", copy: "A third row is less useful if every passenger means leaving bags, tools or recovery gear at home." },
  { icon: ShieldCheck, title: "Factory-engineered safety", copy: "Any extra seating should be designed, tested and certified by the manufacturer—not improvised in the cargo area." },
];

export default function TechWirePage() {
  return (
    <main className="min-h-screen bg-[#e9edf1] text-slate-950">
      <header className="border-b border-slate-300 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Any Part and Gear home">
            <Image src="/apg-logo.webp" alt="Any Part and Gear" width={172} height={50} className="h-12 w-auto object-contain" priority />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 sm:flex"><ArrowLeft className="size-4" /> Marketplace</Link>
            <Link href="/shops" className="rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-[#071a35] shadow-sm hover:bg-amber-300">Local shops</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#071a35] text-white">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[.2em] text-amber-400"><Newspaper className="size-5" /> APG Tech Wire</div>
          <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-5xl font-black uppercase leading-[.95] tracking-tight sm:text-7xl">New machines.<br/><span className="text-amber-400">Straight answers.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Vehicle news, buying guidance and useful tech for people who drive, tow, repair and build.</p>
          <p className="mt-7 inline-flex rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-slate-200">Edition updated September 16, 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
          <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10">
            <div className="flex flex-wrap items-center gap-3"><span className="rounded bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#071a35]">Featured idea</span><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Vehicle watch</span></div>
            <h2 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-tight text-[#071a35] sm:text-6xl">Should Jeep build a three-row Wrangler?</h2>
            <p className="mt-6 text-lg font-semibold leading-8 text-slate-700">Our take: yes—if Jeep can add useful seating without losing the Wrangler’s trail identity. But today, shoppers should know the important part: a factory three-row Wrangler is not in Jeep’s current lineup.</p>
            <div className="mt-8 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-5">
              <p className="font-black text-[#071a35]">The practical answer right now</p>
              <p className="mt-2 leading-7 text-slate-700">Need seven seats? Look at the Grand Cherokee L. Need room for as many as eight plus more cargo and towing capability? Compare the Grand Wagoneer. Want the removable-door, trail-first experience? The Wrangler is still the distinct choice—but it remains a two-row SUV.</p>
            </div>
            <h3 className="mt-10 text-2xl font-black text-[#071a35]">What a three-row Wrangler would need to get right</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {wishList.map(({ icon: Icon, title, copy }) => <section key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5"><Icon className="size-6 text-amber-600"/><h4 className="mt-4 font-black text-[#071a35]">{title}</h4><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></section>)}
            </div>
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h3 className="text-2xl font-black text-[#071a35]">APG verdict</h3>
              <p className="mt-3 leading-7 text-slate-700">The idea makes sense for families who love Wrangler styling but need one more row. The hard part is packaging: a longer body adds weight, affects breakover geometry and can make tight trails harder to navigate. Jeep would have to build a true three-row model—not simply bolt seats into cargo space.</p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-xl bg-[#0b2345] p-6 text-white shadow-xl">
              <Lightbulb className="size-8 text-amber-400" />
              <h2 className="mt-4 text-2xl font-black">Rumor or reality?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">APG separates confirmed factory information from concepts, aftermarket builds and wish-list ideas. This story is an editorial proposal, not a product announcement.</p>
            </div>
            <div className="rounded-xl border border-slate-300 bg-white p-6">
              <Gauge className="size-7 text-amber-600" />
              <h2 className="mt-4 text-xl font-black text-[#071a35]">Before you buy</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {["Confirm the exact seating configuration on the window sticker.", "Compare cargo room with every seat in use.", "Check tow rating for the exact engine and equipment.", "Test third-row entry with the passengers who will use it."].map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600" />{item}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </article>

      <section className="border-y border-slate-300 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Three Jeep paths</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#071a35]">Choose by the job, not just the badge</h2>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {choices.map(choice => <article key={choice.name} className="flex flex-col rounded-xl border border-slate-300 bg-[#f8fafc] p-6"><CarFront className="size-7 text-amber-600"/><h3 className="mt-4 text-2xl font-black text-[#071a35]">{choice.name}</h3><p className="mt-1 text-sm font-bold text-slate-500">{choice.seats}</p><p className="mt-5 text-xs font-black uppercase tracking-wider text-amber-700">Best for</p><p className="mt-1 font-bold">{choice.best}</p><p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{choice.verdict}</p><a href={choice.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-900 hover:text-amber-700">See official details <ExternalLink className="size-4"/></a></article>)}
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500">Specifications and availability can change by trim and market. Verify the exact vehicle with the manufacturer or dealer before purchasing.</p>
        </div>
      </section>

      <section className="bg-[#0b2345] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-amber-400">Keep the project moving</p><h2 className="mt-2 text-3xl font-black">Find vehicles, parts and nearby shops.</h2></div>
          <div className="flex flex-col gap-3 sm:flex-row"><Link href="/?category=Vehicles%20for%20Sale#listings" className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 font-black text-[#071a35] hover:bg-amber-300">Browse vehicles <ArrowRight className="size-4"/></Link><Link href="/shops" className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 font-bold hover:bg-white/10">Find local shops</Link></div>
        </div>
      </section>
    </main>
  );
}
