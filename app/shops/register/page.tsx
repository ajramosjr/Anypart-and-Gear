import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ShopForm from "./shop-form";
import ApgLogo from "@/components/apg-logo";

export default async function RegisterShopPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/shops/register");
  const supabase = await createClient();
  const { data } = await supabase.from("shops").select("name,specialty,description,location,postal_code,hours,website,services,is_verified").eq("owner_id", user.id).maybeSingle();
  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/shops">Shops &amp; Sellers</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Business directory</span><h1 className="page-title">{data ? "Manage your business profile" : "Create a free business profile"}</h1><p>Promote your specialty, services, hours and website so nearby buyers can find and contact you. You can create a profile without listing any individual parts. Inventory listings are optional and can be added later. APG reviews publicly available business information before unlocking customer requests.</p></div><div className="card-panel"><ShopForm userId={user.id} shop={data}/></div></div></main>;
}
