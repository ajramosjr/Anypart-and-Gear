import type { Metadata } from "next";
import Link from "next/link";
import { Anchor, ArrowLeft, Bike, ExternalLink, GraduationCap, HardHat, ShieldCheck, Truck, Wrench } from "lucide-react";
import ApgLogo from "@/components/apg-logo";

export const metadata: Metadata = {
  title: "APG Links | Courses, Training & Industry Resources",
  description: "Trusted course directories, training programs and official resources for boating, motorcycles, CDL, welding, automotive, marine trades and workplace safety.",
};

const resources = [
  { category: "Boating", name: "NASBLA Boating Education", description: "Find state-approved boating education courses and review the requirements that apply where you operate.", href: "https://www.nasbla.org/education/taking-a-boat-course", icon: Anchor, label: "Official course resource" },
  { category: "Motorcycle", name: "Motorcycle Safety Foundation", description: "Explore beginner, returning-rider and advanced RiderCourses, including online learning options.", href: "https://msf-usa.org/start-your-ride/", icon: Bike, label: "Independent course provider" },
  { category: "CDL & Trucking", name: "FMCSA Training Provider Registry", description: "Search the federal registry for entry-level driver training providers by location and training type.", href: "https://tpr.fmcsa.dot.gov/search", icon: Truck, label: "Official government registry" },
  { category: "Welding", name: "American Welding Society", description: "Browse self-paced online welding education for students and working professionals.", href: "https://www.aws.org/certification-and-education/education/self-paced-online-learning/", icon: HardHat, label: "Independent course provider" },
  { category: "Automotive & Diesel", name: "ASE Accredited Training", description: "Search for accredited automotive, collision and truck training programs and industry resources.", href: "https://ase.com/find-accredited-training/", icon: Wrench, label: "Independent program directory" },
  { category: "Marine Technician", name: "ABYC Education", description: "Explore marine technician certification courses, online learning and marine trades education paths.", href: "https://abycinc.org/education/", icon: GraduationCap, label: "Independent course provider" },
  { category: "Workplace Safety", name: "OSHA Training Resources", description: "Find authorized education centers, course schedules and workplace safety training resources.", href: "https://www.osha.gov/training/", icon: ShieldCheck, label: "Official government resource" },
];

function sectionId(category: string) {
  return category.toLowerCase().replaceAll(" ", "-").replace("&", "and");
}

export default function ApgLinksPage() {
  return (
    <main className="min-h-screen bg-[#f3f5f8] text-slate-950">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <ApgLogo priority />
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 sm:flex"><ArrowLeft className="size-4" /> Marketplace</Link>
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
          <p className="text-xs font-black uppercase tracking-[.18em] text-amber-700">Learn new skills</p>
          <h2 id="resource-directory-title" className="mt-2 text-3xl font-black text-[#071a35]">Training and course directory</h2>
          <p className="mt-3 leading-7 text-slate-600">Choose a category, then confirm course requirements, cost and availability directly with the organization.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" aria-label="Resource categories">
          {resources.map((resource) => <a key={resource.category} href={`#${sectionId(resource.category)}`} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-[#071a35] transition hover:border-amber-500 hover:bg-amber-50">{resource.category}</a>)}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <article id={sectionId(resource.category)} key={resource.name} className="scroll-mt-6 flex min-h-80 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4"><span className="grid size-12 place-items-center rounded-xl bg-[#071a35] text-amber-400"><Icon className="size-6" /></span><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">{resource.category}</span></div>
                <h3 className="mt-6 text-xl font-black text-[#071a35]">{resource.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{resource.description}</p>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.1em] text-slate-500">{resource.label}</p>
                <a href={resource.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-500 bg-amber-400 px-5 py-3 text-sm font-black text-[#071a35] shadow-sm transition hover:bg-amber-300">Visit resource <ExternalLink className="size-4" /></a>
              </article>
            );
          })}
        </div>

        <aside className="mt-10 rounded-2xl border border-slate-300 bg-white p-6 sm:p-8" aria-label="Directory notice">
          <div className="flex gap-4"><ShieldCheck className="mt-0.5 size-6 shrink-0 text-amber-600" /><div><h2 className="font-black text-[#071a35]">Independent resource directory</h2><p className="mt-2 text-sm leading-6 text-slate-600">APG does not administer these courses, collect tuition, approve providers or issue certificates. A listing does not imply sponsorship or partnership. Requirements, pricing and availability may change, so confirm all details with the provider and the appropriate licensing agency before enrolling.</p></div></div>
        </aside>
      </section>
    </main>
  );
}
