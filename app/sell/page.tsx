import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import SellForm from "./sell-form";
import ApgLogo from "@/components/apg-logo";
import NotificationBell from "@/components/notification-bell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SellPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/sell");
  const supabase = await createClient();
  const { data: shop } = await supabase.from("shops").select("id,name").eq("owner_id", user.id).eq("is_active", true).maybeSingle();
  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/">Back to marketplace</Link><NotificationBell userId={user.id}/></nav></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Seller tools</span><h1 className="page-title">Post an item</h1><p>Add clear details and photos. Buyers will contact you directly about payment, pickup or delivery.</p><Link className="inline-link" href="/sell/bulk">Business seller? Upload by CSV — 100 active listings per account →</Link></div><div className="card-panel"><SellForm userId={user.id} sellerName={shop?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Seller"} shop={shop} /></div></div></main>;
}
