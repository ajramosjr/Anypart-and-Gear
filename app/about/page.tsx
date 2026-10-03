import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ApgLogo from "@/components/apg-logo";

export const metadata: Metadata = {
  title: "About Us | Any Part & Gear",
  description: "Meet Angelo Ramos and learn why he founded Any Part & Gear.",
};

export default function AboutPage() {
  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/marketplace">Marketplace</Link><Link href="/shops">Parts &amp; Repair Directory</Link></nav></div></header>
    <div className="shell pt-10 sm:pt-14"><p className="eyebrow">About us</p><h1 className="section-title mt-2">The story behind APG</h1></div>
    <section id="founder" className="bg-white mt-8" aria-labelledby="founder-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-16">
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-300 bg-[#071a35] shadow-2xl shadow-slate-900/15 lg:max-w-none">
          <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-amber-400" />
          <Image
            src="/angelo-ramos-founder.webp"
            alt="Angelo Ramos, founder of Any-Part and Gear"
            width={1088}
            height={1453}
            sizes="(max-width: 1024px) 448px, 42vw"
            className="aspect-[4/5] w-full object-cover object-top"
          />
        </div>
        <div>
          <p className="eyebrow">Meet the founder</p>
          <h2 id="founder-title" className="section-title mt-2">Built by someone who understands the search.</h2>
          <h3 className="mt-6 text-xl font-black text-[#0b2345]">Angelo Ramos</h3>
          <p className="mt-1 text-sm font-bold uppercase tracking-[.12em] text-amber-700">Founder, Any-Part and Gear</p>
          <div className="mt-6 max-w-2xl space-y-4 text-base leading-7 text-slate-600">
            <p>After years of working around vehicles, tools, equipment, and hard-to-find parts, I created APG to bring individuals and local businesses together in one convenient marketplace.</p>
            <p>APG gives people a place to buy, sell, and trade parts and gear while helping local businesses showcase what they offer and connect with more potential customers.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="gold-button h-11 px-6 font-black"><Link href="/marketplace">Explore the marketplace</Link></Button>
            <Button asChild variant="outline" className="h-11 border-slate-300 bg-white px-6 font-bold text-[#0b2345] hover:bg-slate-50"><Link href="/shops">Explore the Parts &amp; Repair Directory</Link></Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-black uppercase tracking-[.12em] text-slate-500">Follow APG</span>
            <a href="https://www.facebook.com/share/1GRGa1eFPK/" target="_blank" rel="noopener noreferrer" aria-label="Follow Any-Part and Gear on Facebook" className="inline-flex size-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition hover:bg-[#0f67d8]"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-white" fill="currentColor"><path d="M13.6 22v-8h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.7-1.6H17V4.4c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.1H7.3V14h2.8v8h3.5Z"/></svg></a>
            <a href="https://www.instagram.com/apgmarketplace/" target="_blank" rel="noopener noreferrer" aria-label="Follow APG Marketplace on Instagram" className="inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-sm transition hover:brightness-110"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://www.linkedin.com/company/any-part-and-gear/" target="_blank" rel="noopener noreferrer" aria-label="Follow Any-Part and Gear on LinkedIn" className="inline-flex size-11 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-sm transition hover:bg-[#084f96]"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.86H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.26Z"/></svg></a>
          </div>
        </div>
      </div>
    </section>

  </main>;
}
