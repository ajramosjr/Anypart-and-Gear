import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ReportAction, VerifyShop } from "./moderation-actions";
import TechWireEditor from "./tech-wire-editor";
import type { DatabaseTechArticle } from "@/app/tech-wire/article-store";

type Report = { id:string; reason:string; details:string|null; status:string; created_at:string; listings:{title:string}|null };
type Shop = { id:string; name:string; specialty:string; location:string; is_verified:boolean; is_active:boolean };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (user.app_metadata?.role !== "admin") redirect("/account");
  const supabase = await createClient();
  const [{ data: reports }, { data: shops }, { data: articles }] = await Promise.all([
    supabase.from("reports").select("id,reason,details,status,created_at,listings(title)").order("created_at", { ascending:false }).limit(100),
    supabase.from("shops").select("id,name,specialty,location,is_verified,is_active").order("created_at", { ascending:false }).limit(100),
    supabase.from("tech_articles").select("id,slug,image_url,category,title,summary,read_time,sections,sources,status,published_at,created_at,updated_at").order("updated_at", { ascending:false }),
  ]);

  return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href="/account">My account</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Owner controls</span><h1 className="page-title">Admin dashboard</h1><p>Publish Tech Wire articles, review reports and approve businesses.</p></div>
    <TechWireEditor initialArticles={(articles || []) as DatabaseTechArticle[]} userId={user.id} />
    <h2 className="admin-section">Listing reports</h2><div className="admin-list">{((reports || []) as unknown as Report[]).map((report) => <article className="admin-row" key={report.id}><div><strong>{report.reason}</strong><p>{report.listings?.title || "Removed listing"}</p>{report.details && <small>{report.details}</small>}</div><ReportAction id={report.id} status={report.status} /></article>)}{!reports?.length && <p>No reports waiting.</p>}</div>
    <h2 className="admin-section">Business verification</h2><div className="admin-list">{((shops || []) as Shop[]).map((shop) => <article className="admin-row" key={shop.id}><div><strong>{shop.name}</strong><p>{shop.specialty} · {shop.location}</p><small>{shop.is_verified ? "Verified" : "Not verified"}</small></div><VerifyShop id={shop.id} verified={shop.is_verified} /></article>)}{!shops?.length && <p>No shops registered yet.</p>}</div>
  </div></main>;
}
