import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ShopForm from "./shop-form";

export default async function RegisterShopPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/shops/register");
  const supabase = await createClient();
  const { data } = await supabase.from("shops").select("name,specialty,description,location,postal_code,hours,website,services").eq("owner_id", user.id).maybeSingle();
  return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href="/shops">Local shops</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Business directory</span><h1 className="page-title">{data ? "Manage your shop" : "Add your business"}</h1><p>Help nearby buyers find your parts and services. Customers can contact you privately through Any Part &amp; Gear.</p></div><div className="card-panel"><ShopForm userId={user.id} shop={data}/></div></div></main>;
}
