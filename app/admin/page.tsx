import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ReportAction, VerifyShop } from "./moderation-actions";
import TechWireEditor from "./tech-wire-editor";
import type { DatabaseTechArticle } from "@/app/tech-wire/article-store";
import ApgLogo from "@/components/apg-logo";

type Report = { id:string; reason:string; details:string|null; status:string; created_at:string; listings:{title:string}|null };
type Shop = { id:string; name:string; specialty:string; location:string; postal_code:string; website:string|null; is_verified:boolean; is_active:boolean };
export const dynamic = "force-dynamic";

function safeWebsite(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (user.app_metadata?.role !== "admin") redirect("/account");
  const supabase = await createClient();
  const { data: totals, error: totalsError } = await supabase.rpc("apg_admin_totals");
  const [{ data: reports }, { data: shops }, { data: articles }] = await Promise.all([
    supabase.from("reports").select("id,reason,details,status,created_at,listings(title)").order("created_at", { ascending:false }).limit(100),
    supabase.from("shops").select("id,name,specialty,location,postal_code,website,is_verified,is_active").order("created_at", { ascending:false }).limit(100),
    supabase.from("tech_articles").select("id,slug,image_url,category,title,summary,read_time,sections,sources,status,published_at,created_at,updated_at").order("updated_at", { ascending:false }),
  ]);

  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/account">My account</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Owner controls</span><h1 className="page-title">Admin dashboard</h1><p>Publish Parts &amp; Industry News articles, review reports and approve businesses.</p></div>
    <section aria-label="Private site totals" className="mb-10">
      <h2 className="mb-4 text-xl font-bold">Your site at a glance</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: "Total registered users", value: totals?.total_users }, { label: "New sign-ups this month", value: totals?.new_users }, { label: "Estimated visitors this month", value: totals?.visitors }].map(stat => <article key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5"><h3 className="text-sm font-semibold text-slate-600">{stat.label}</h3><p className="mt-3 text-4xl font-black text-[#071a35]">{totalsError || typeof stat.value !== "number" ? "Unavailable" : stat.value.toLocaleString()}</p></article>)}
      </div>
      <p className="mt-3 text-sm text-slate-600">Private to administrators. Sign-ups include accounts awaiting email confirmation. Months use New York time. Visitor counting began October 6, 2026; earlier visits are not included. Visitors are estimated by browser; repeat visits count once per month. Common bots and signed-in administrators are excluded.</p>
      {totalsError && <p role="status" className="mt-2 text-sm text-amber-800">Totals could not be loaded. Refresh this page to try again.</p>}
    </section>
    <TechWireEditor initialArticles={(articles || []) as DatabaseTechArticle[]} userId={user.id} />
    <h2 className="admin-section">Listing reports</h2><div className="admin-list">{((reports || []) as unknown as Report[]).map((report) => <article className="admin-row" key={report.id}><div><strong>{report.reason}</strong><p>{report.listings?.title || (report.reason.startsWith("Directory:") ? "Directory business report" : "Removed listing")}</p>{report.details && <small>{report.details}</small>}</div><ReportAction id={report.id} status={report.status} /></article>)}{!reports?.length && <p>No reports waiting.</p>}</div>
    <h2 className="admin-section">Business verification</h2><p className="admin-section-note">Review the business name, location and public page. APG does not collect licenses, IDs or other verification documents.</p><div className="admin-list">{((shops || []) as Shop[]).map((shop) => <article className="admin-row" key={shop.id}><div><strong>{shop.name}</strong><p>{shop.specialty} · {shop.location} {shop.postal_code}</p>{safeWebsite(shop.website) && <a href={safeWebsite(shop.website)!} target="_blank" rel="noopener noreferrer nofollow">Review public business page</a>}<small>{shop.is_verified ? "APG-verified" : "Awaiting review"}</small><p><Link href={`/admin/business-post?shop=${shop.id}`}>Post a shop-approved photo for this business</Link></p></div><VerifyShop id={shop.id} verified={shop.is_verified} /></article>)}{!shops?.length && <p>No shops registered yet.</p>}</div>
  </div></main>;
}
