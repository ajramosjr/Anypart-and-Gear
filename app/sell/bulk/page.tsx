import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import BulkUpload from "./bulk-upload";
import ApgLogo from "@/components/apg-logo";

export const dynamic = "force-dynamic";

export default async function BulkSellPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/sell/bulk");

  const supabase = await createClient();
  const [{ count }, { data: shop }] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
    supabase.from("shops").select("name").eq("owner_id", user.id).eq("is_active", true).maybeSingle(),
  ]);
  const sellerName = shop?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Seller";

  return <main>
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/sell">Post one item</Link></div></header>
    <div className="shell page-shell">
      <div className="page-intro">
        <span className="kicker">Business seller tools</span>
        <h1 className="page-title">Bulk inventory upload</h1>
        <p>Upload up to 100 items per CSV. Each business account may have up to 100 active listings total. Sold and removed listings do not count.</p>
        <p>Required columns: title, description, price, condition, category, location and image_url. Optional column: trade.</p>
      </div>
      <div className="card-panel"><BulkUpload userId={user.id} sellerName={sellerName} initialActiveCount={count || 0} /></div>
    </div>
  </main>;
}
