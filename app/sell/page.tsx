import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import SellForm from "./sell-form";
import GearHelpButton from "./gear-help-button";
import ApgLogo from "@/components/apg-logo";
import NotificationBell from "@/components/notification-bell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SellPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/sell");
  const supabase = await createClient();
  const { data: shop } = await supabase.from("shops").select("id,name").eq("owner_id", user.id).eq("is_active", true).maybeSingle();
  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/marketplace">Back to marketplace</Link><NotificationBell userId={user.id}/></nav></div></header><div className="shell page-shell"><div className="page-intro sell-intro"><span className="kicker">Seller tools</span><h1 className="page-title">Sell a part or gear</h1><p>Add photos, set your price, and connect directly with buyers.</p><Link className="inline-link" href="/sell/bulk">Have multiple items? Bulk upload →</Link><GearHelpButton /></div><div className="card-panel"><SellForm userId={user.id} sellerName={shop?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Seller"} shop={shop} /></div></div></main>;
}
