import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { directoryBusinesses } from "../directory-businesses";
import ShopForm from "./shop-form";
import ApgLogo from "@/components/apg-logo";

export default async function RegisterShopPage({ searchParams }: { searchParams: Promise<{ directory?: string; submitted?: string }> }) {
  const { directory, submitted } = await searchParams;
  const selected = directoryBusinesses.find((business) => `${business.name}|${business.postal_code}` === directory);
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/shops/register${selected ? `?directory=${encodeURIComponent(directory!)}` : ""}`)}`);
  const supabase = await createClient();
  const { data } = await supabase.from("shops").select("name,specialty,description,location,postal_code,hours,website,services,is_verified").eq("owner_id", user.id).maybeSingle();
  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/shops">Parts &amp; Repair Directory</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Business directory</span><h1 className="page-title">{data ? "Manage your business profile" : "Create a free business profile"}</h1><p>Promote your specialty, services, hours and website so nearby buyers can find and contact you. You can create a profile without listing any individual parts. Inventory listings are optional and can be added later. Request activation to receive Parts Wanted requests and respond through APG Messages. An administrator confirms your authority to represent the business before approving activation.</p></div><div className="card-panel">{submitted === "1" && <p role="status" className="mb-4">Business activation request submitted. You can check its status below.</p>}<ShopForm userId={user.id} shop={data} directoryBusiness={selected}/></div></div></main>;
}
