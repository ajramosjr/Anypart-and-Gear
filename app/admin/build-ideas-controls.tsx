import Link from "next/link";
import { getBuildIdeasState } from "@/lib/build-ideas";
import { setBuildIdeasEnabled } from "./build-ideas-actions";
export default async function BuildIdeasControls({ message }: { message?: string }) {
  const { enabled, available } = await getBuildIdeasState();
  return <section aria-labelledby="build-ideas-controls-title" className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
    <h2 id="build-ideas-controls-title" className="text-xl font-black">Build Ideas visibility</h2>
    <p className="mt-3 font-bold">Public website: {enabled ? "Enabled" : "Disabled"}</p>
    <p className="mt-3 text-slate-600">There are no project guides currently. While disabled, Build Ideas is hidden from visitors and only administrators can preview the section.</p>
    <div className="mt-5 flex flex-wrap items-center gap-5"><form action={setBuildIdeasEnabled}><button type="submit" role="switch" aria-checked={enabled} name="enabled" value={enabled ? "false" : "true"} disabled={!available} className="min-h-12 rounded-lg bg-amber-400 px-5 font-black text-[#071a35] disabled:opacity-50">{enabled ? "Disable Build Ideas" : "Enable Build Ideas"}</button></form><Link href="/build-ideas" className="font-bold underline">Private admin preview</Link></div>
    {message === "saved" && <p role="status" className="mt-4 text-green-800">Build Ideas visibility saved.</p>}
    {(message === "error" || !available) && <p role="alert" className="mt-4 text-red-800">The setting could not be loaded or saved. Refresh and try again.</p>}
  </section>;
}
