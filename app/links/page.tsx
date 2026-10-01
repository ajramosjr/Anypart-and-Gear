import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BadgeCheck, GraduationCap } from "lucide-react";
import ApgLogo from "@/components/apg-logo";

export const metadata: Metadata = {
  title: "APG Links | Courses, Training & Industry Resources",
  description: "APG's directory for courses, training and trusted industry resources.",
};

const categories = ["Boating", "Motorcycle", "CDL & Trucking", "Welding", "Automotive & Diesel", "Marine Technician", "Workplace Safety"];

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

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            category === "Boating" ? (
              <section key={category} className="flex min-h-72 flex-col rounded-2xl border border-amber-300 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-[#071a35] text-amber-400"><GraduationCap className="size-6" /></span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800"><BadgeCheck className="size-4" /> Listed with permission</span>
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[.16em] text-amber-700">Boating</p>
                <h3 className="mt-1 text-2xl font-black text-[#071a35]">BoatUS Foundation</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">Online boating safety and skills training for beginner and experienced boaters, with free and paid course options.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">Free courses available</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">Paid options available</span></div>
                <a href="https://boatus.org/free-courses/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 font-black text-[#071a35] shadow-sm hover:bg-amber-300">View BoatUS courses <ArrowUpRight className="size-4" /></a>
              </section>
            ) : category === "Motorcycle" ? (
              <section id="on-the-road-again" key={category} className="flex min-h-72 scroll-mt-24 flex-col rounded-2xl border border-amber-300 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-[#071a35] text-amber-400"><GraduationCap className="size-6" /></span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800"><BadgeCheck className="size-4" /> Listed with permission</span>
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[.16em] text-amber-700">Motorcycle</p>
                <h3 className="mt-1 text-2xl font-black text-[#071a35]">On the Road Again Motorcycle School</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">Motorcycle training and rider education at four New York training locations. Course schedules, pricing and registration are handled directly by the school.</p>
                <a href="https://lrn2ride.com/courses/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 font-black text-[#071a35] shadow-sm hover:bg-amber-300">View motorcycle courses <ArrowUpRight className="size-4" /></a>
              </section>
            ) : (
              <section key={category} className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
                <span className="grid size-12 place-items-center rounded-xl bg-[#071a35] text-amber-400"><GraduationCap className="size-6" /></span>
                <h3 className="mt-5 text-xl font-black text-[#071a35]">{category}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Providers coming after permission is received.</p>
              </section>
            )
          ))}
        </div>
        <p className="mt-8 text-sm leading-6 text-slate-500">BoatUS Foundation and On the Road Again Motorcycle School are independent course providers. Listings in APG Links do not imply sponsorship or a partnership with APG.</p>
      </section>
    </main>
  );
}
