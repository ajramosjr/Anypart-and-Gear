import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import SellForm from "./sell-form";

export const dynamic = "force-dynamic";

export default async function SellPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/sell");
  return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href="/">Back to marketplace</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Seller tools</span><h1 className="page-title">Post an item</h1><p>Add clear details and photos. Buyers will contact you directly about payment, pickup or delivery.</p><Link className="inline-link" href="/sell/bulk">Business seller? Upload up to 500 items by CSV →</Link></div><div className="card-panel"><SellForm userId={user.id} sellerName={user.user_metadata?.full_name || user.email?.split("@")[0] || "Seller"} /></div></div></main>;
}

