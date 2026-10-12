import Link from "next/link";
import { getTechWireState } from "@/lib/tech-wire";
import { setTechWireEnabled } from "./tech-wire-actions";
export default async function TechWireControls({ message }: { message?: string }) {
  const { enabled, available } = await getTechWireState();
  return <section aria-labelledby="tech-wire-controls-title" className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
    <h2 id="tech-wire-controls-title" className="text-xl font-black">Tech Wire visibility</h2>
    <p className="mt-3 font-bold">Public website: {enabled ? "Enabled" : "Disabled"}</p>
    <p className="mt-3 text-slate-600">Articles stay saved. While disabled, Tech Wire is hidden from visitors and only administrators can preview it.</p>
    <div className="mt-5 flex flex-wrap items-center gap-5"><form action={setTechWireEnabled}><button type="submit" role="switch" aria-checked={enabled} name="enabled" value={enabled ? "false" : "true"} disabled={!available} className="min-h-12 rounded-lg bg-amber-400 px-5 font-black text-[#071a35] disabled:opacity-50">{enabled ? "Disable Tech Wire" : "Enable Tech Wire"}</button></form><Link href="/tech-wire" className="font-bold underline">Private admin preview</Link></div>
    {message === "saved" && <p role="status" className="mt-4 text-green-800">Tech Wire visibility saved.</p>}
    {(message === "error" || !available) && <p role="alert" className="mt-4 text-red-800">The setting could not be loaded or saved. Refresh and try again.</p>}
  </section>;
}
