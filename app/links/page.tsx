import PageMenu from "@/components/page-menu";
import type { Metadata } from "next";
import Link from "next/link";
import { TechWireLink } from "@/components/tech-wire-navigation";
import { BookOpen, Fish, ArrowLeft } from "lucide-react";
import ApgLogo from "@/components/apg-logo";
import TrainingDirectory from "@/components/training-directory";

export const metadata: Metadata = {
  title: "Learning & Resources | Any Part & Gear",
  description: "APG's directory for courses, training and trusted industry resources.",
};

export default function ApgLinksPage() {
  return (
    <main className="apg-resources min-h-screen bg-[#f3f5f8] text-slate-950">
      <header className="apg-site-header border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <ApgLogo priority />
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="hidden items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 sm:flex"><ArrowLeft className="size-4" /> Marketplace</Link>
            <TechWireLink href="/tech-wire" className="apg-header-control rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-[#071a35] shadow-sm hover:bg-amber-300">APG Tech Wire</TechWireLink>
          </div>
        <PageMenu /></div>
      </header>

      <section className="resources-hero">
        <div className="resources-shell">
          <h1>Learning &amp; Resources</h1>
          <p>Training, practice tests and outdoor licensing resources.</p>
        </div>
      </section>
      <div className="resources-shell resources-content">
        <div className="resource-highlights">
          <section className="resource-card" aria-labelledby="practice-title">
            <BookOpen size={28} aria-hidden="true" />
            <h2 id="practice-title">Practice Tests</h2>
            <p>Build your knowledge with automotive, boating, tools, CDL and motorcycle practice tests.</p>
            <Link href="/practice-tests" className="resource-action">Explore Practice Tests <span aria-hidden="true">→</span></Link>
          </section>
          <section id="fishing-hunting" className="resource-card" aria-labelledby="fishing-hunting-title">
            <Fish size={28} aria-hidden="true" />
            <h2 id="fishing-hunting-title">New York Fishing &amp; Hunting</h2>
            <p>Find freshwater fishing and hunting licenses, plus the free recreational saltwater fishing registry.</p>
            <a href="https://dec.ny.gov/regulatory/permits-licenses/sporting-and-use" className="resource-action">Visit NYS DEC <span aria-hidden="true">↗</span></a>
            <small>Opens the official NYS DEC website. APG is an independent resource and is not affiliated with NYS DEC.</small>
          </section>
        </div>
        <TrainingDirectory />
        <p className="resources-disclaimer">Confirm pricing, eligibility and training locations directly with each provider. Independent listings do not imply sponsorship, endorsement or a partnership with APG. A “Listed with permission” label appears only where permission has been received.</p>
      </div>
    </main>
  );
}
