import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ApgLogo from "@/components/apg-logo";
import TrainingDirectory from "@/components/training-directory";

export const metadata: Metadata = {
  title: "APG Links | Courses, Training & Industry Resources",
  description: "APG's directory for courses, training and trusted industry resources.",
};

export default function ApgLinksPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f8] text-slate-950">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <ApgLogo priority />
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="hidden items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 sm:flex"><ArrowLeft className="size-4" /> Marketplace</Link>
            <Link href="/tech-wire" className="rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-[#071a35] shadow-sm hover:bg-amber-300">APG Tech Wire</Link>
          </div>
        </div>
      </header>

      <section className="bg-[#071a35] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-black uppercase tracking-[.2em] text-amber-400">Trusted resources</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-[-.03em] sm:text-6xl">APG Links</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Courses, training and trusted industry resources—all in one place.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="resource-directory-title">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Approved providers</p>
          <h2 id="resource-directory-title" className="mt-2 text-3xl font-black text-[#071a35]">Training and course directory</h2>
          <p className="mt-3 leading-7 text-slate-600">APG lists course providers only after receiving permission. Course prices and availability are controlled by each provider.</p>
        </div>

        <TrainingDirectory />
        <p className="mt-8 leading-7 text-slate-600">More training schools and course providers will be added as we receive their permission to list them.</p>
        <p className="mt-8 text-sm leading-6 text-slate-500">BoatUS Foundation and On the Road Again Motorcycle School are independent course providers. Listings in APG Links do not imply sponsorship or a partnership with APG.</p>
      </section>
    </main>
  );
}
