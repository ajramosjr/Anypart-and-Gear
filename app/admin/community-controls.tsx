import Link from "next/link";
import { COMMUNITY_URL, getCommunityState } from "@/lib/community";
import { setCommunityEnabled } from "./community-actions";

export default async function CommunityControls({ message }: { message?: string }) {
  const { enabled, available } = await getCommunityState();
  return <section aria-labelledby="community-controls-title" className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
    <h2 id="community-controls-title" className="text-xl font-black">APG Community</h2>
    <p className="mt-3 font-bold">Website status: {enabled ? "Active" : "Coming Soon"}</p>
    <p className="mt-3 leading-7 text-slate-600">Activating enables the forum link on APG. Turning it off restores the Coming Soon page. Before launch, open registration and adjust privacy in your Discourse admin settings.</p>
    <div className="mt-5 flex flex-wrap items-center gap-5">
      <form action={setCommunityEnabled}><button type="submit" role="switch" aria-checked={enabled} name="enabled" value={enabled ? "false" : "true"} disabled={!available} className="min-h-12 rounded-lg px-5 font-black disabled:opacity-50" style={{ backgroundColor: "#e6b944", color: "#071a35" }}>{enabled ? "Disable Community" : "Activate Community"}</button></form>
      <Link href="/community" className="font-bold underline">Preview website page</Link>
      <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline">Manage forum ↗</a>
    </div>
    {message === "saved" && <p role="status" className="mt-4 text-green-800">Community setting saved.</p>}
    {(message === "error" || !available) && <p role="alert" className="mt-4 text-red-800">The community setting could not be loaded or saved. Refresh and try again.</p>}
  </section>;
}
