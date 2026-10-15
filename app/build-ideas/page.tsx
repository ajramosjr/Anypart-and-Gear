import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { requireBuildIdeasAccess, getBuildIdeasState } from "@/lib/build-ideas";
import SiteHeader from "@/components/site-header";
import "./print.css";
import PrintButton from "./print-button";
export const dynamic = "force-dynamic";
export const metadata = { title: "APG Build Ideas | Garage Projects", robots: { index: false, follow: false } };
const stages = [
  { title: "1. Choose your go-kart plan", text: "Start with a documented chassis kit and its manufacturer's assembly manual. Confirm rider fit, maximum rider weight, intended terrain and braking requirements. Save the exact manual and parts list before ordering." },
  { title: "2. Gather matched parts", text: "Use the plan's specified frame, steering assembly, brakes, axle, wheels, seat, guards and hardware. For an electric build, use a matched motor, controller, battery and charger approved for the kit. Record part numbers; do not substitute safety-critical parts without the manufacturer's approval." },
  { title: "3. Prepare the workspace", text: "Read the manual fully. Organize hardware and tools, secure the chassis and wear the PPE required for each operation. Younger builders need an experienced adult supervising. Keep the battery disconnected during mechanical assembly." },
  { title: "4. Assemble and photograph each stage", text: "Follow the selected manual's assembly sequence, dimensions, fastener grades and torque values. Capture the bare chassis, rolling chassis, steering and brakes, and completed drive system. This draft does not provide fabrication dimensions or replace that manual." },
  { title: "5. Inspect before the first ride", text: "Have an experienced builder inspect the frame, fasteners, steering travel, brakes, guards, throttle return and accessible power cutoff. Use the manufacturer's commissioning procedure in a clear, controlled area with appropriate riding protection. Resolve any binding, loose parts or unreliable controls before riding." },
];
export default async function BuildIdeasPage() {
  await requireBuildIdeasAccess();
  const user = await getUser();
  if (!user) redirect("/login?next=/build-ideas");
  const { enabled } = await getBuildIdeasState();
  return <main className="build-ideas-page"><div className="no-print"><SiteHeader signedIn /></div><div className="shell page-shell max-w-4xl">
    {!enabled && <aside className="no-print mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4"><strong>Private admin preview — Build Ideas is disabled.</strong><p>Draft content. A specific build plan, reviewed instructions and stage photos still need to be added.</p><Link className="underline" href="/admin">Back to admin controls</Link></aside>}
    <span className="kicker">Learn • Build • Share</span><h1 className="page-title">APG Build Ideas</h1><p className="mb-8 text-lg">Creative garage projects worth getting your hands dirty for. Follow a project, make it your own, and show APG what you built.</p>
    <article className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"><p className="font-bold text-amber-800">Featured project · Guide in preparation</p><h2 className="my-3 text-3xl font-black">Build an electric go-kart</h2><p>A kit-based project for builders with mechanical experience. Start here with a printable planning checklist; the complete build guide is being prepared.</p>
    <section className="my-6 rounded-lg bg-slate-100 p-5"><h3 className="text-xl font-bold">Before you build</h3><p className="mt-2">APG has not built or tested this project. This is a planning outline, not a complete engineering or assembly plan. Follow the selected kit’s instructions and have critical work inspected. PPE and disclaimers do not replace sound construction or working brakes.</p></section>
    <div className="grid gap-6 sm:grid-cols-2"><section><h3 className="text-xl font-bold">Materials to plan for</h3><ul className="my-3 list-disc space-y-2 pl-6"><li>Documented chassis kit with steering, brakes, axle and wheels</li><li>Seat, specified mounting hardware and drive guards</li><li>Matched electric drive, protected battery and compatible charger</li><li>Manufacturer-specified wiring, fuses and power cutoff</li></ul></section><section><h3 className="text-xl font-bold">Tools and protection</h3><ul className="my-3 list-disc space-y-2 pl-6"><li>Manual-specified sockets, wrenches and torque wrench</li><li>Measuring tools and secure work supports</li><li>Eye protection and task-appropriate PPE</li><li>Electrical tools specified by the kit manufacturer</li></ul></section></div>
    <h3 className="mt-8 text-2xl font-black">Project stages</h3>{stages.map(stage => <section key={stage.title} className="my-6 break-inside-avoid"><h4 className="text-xl font-bold">{stage.title}</h4><p className="mt-2">{stage.text}</p><label className="mt-3 flex items-center gap-3"><input type="checkbox" /> Planning step reviewed</label></section>)}
    <PrintButton /><section className="mt-8 border-t border-slate-200 pt-6"><h3 className="text-xl font-bold">Show APG what you built</h3><p className="mt-2">A finished-project showcase is planned. Submission instructions will be added before launch.</p></section></article>
    <section className="my-8"><h2 className="text-2xl font-black">More garage inspiration</h2><p className="mt-3">Gas go-karts, custom RC builds and scrap-metal art are ideas for future guides.</p></section>
  </div></main>;
}
