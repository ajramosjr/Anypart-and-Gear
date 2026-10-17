import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { requireBuildIdeasAccess, getBuildIdeasState } from "@/lib/build-ideas";
import SiteHeader from "@/components/site-header";

export const dynamic = "force-dynamic";
export const metadata = { title: "APG Build Ideas | Any Part & Gear", robots: { index: false, follow: false } };

export default async function BuildIdeasPage() {
  await requireBuildIdeasAccess();
  const user = await getUser();
  if (!user) redirect("/login?next=/build-ideas");
  const { enabled } = await getBuildIdeasState();
  return <main>
    <SiteHeader signedIn />
    <div className="shell max-w-4xl">
      {!enabled && <aside className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <strong>Private admin preview — hidden from members.</strong>
        <p><Link className="underline" href="/admin">Back to administration</Link></p>
      </aside>}
      <span className="kicker">APG Build Ideas</span>
      <h1 className="page-title">Build Ideas</h1>
      <section className="my-6 rounded-xl border border-slate-200 bg-white p-6">
        <p>No projects are available right now.</p>
        <Link href="/marketplace" className="mt-4 inline-block font-bold underline">Browse the marketplace</Link>
      </section>
    </div>
  </main>;
}
