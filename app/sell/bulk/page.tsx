import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import BulkUpload from "./bulk-upload";
export const dynamic = "force-dynamic";
export default async function BulkSellPage() { const user = await getUser(); if (!user) redirect("/login?next=/sell/bulk"); return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href="/sell">Post one item</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Business seller tools</span><h1 className="page-title">Bulk inventory upload</h1><p>Upload a CSV with up to 500 items. Required columns: title, description, price, condition, category, location and image_url. Optional column: trade.</p></div><div className="card-panel"><BulkUpload userId={user.id} sellerName={user.user_metadata?.full_name || user.email?.split("@")[0] || "Seller"} /></div></div></main>; }
