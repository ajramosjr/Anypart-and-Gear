import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleBrowser from "./article-browser";
import { getPublishedTechArticles } from "./article-store";

export const metadata: Metadata = {
  title: "APG Parts & Industry News | Supply-chain updates, recalls and buying guides",
  description: "Practical coverage of parts availability, recalls, supply-chain changes, pricing and useful technology for drivers, shops and builders.",
};

export const revalidate = 300;

export default async function TechWirePage() {
  const techArticles = await getPublishedTechArticles();

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-950">
      <header className="border-b border-slate-300 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Any Part and Gear home">
            <Image src="/apg-logo.webp" alt="Any Part and Gear" width={172} height={50} className="h-12 w-auto object-contain" priority />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/marketplace" className="hidden items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 sm:flex"><ArrowLeft className="size-4" /> Marketplace</Link>
            <Link href="/shops" className="rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-[#071a35] shadow-sm hover:bg-amber-300">Parts Stores &amp; Shops</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Parts, recalls, supply chain, vehicles &amp; tools</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#071a35] sm:text-4xl">Latest from APG</h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600">Search APG news and view one story at a time.</p>
        </div>
        <ArticleBrowser articles={techArticles} />
      </section>
    </main>
  );
}
