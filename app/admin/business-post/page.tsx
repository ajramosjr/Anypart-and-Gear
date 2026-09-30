import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";
import BusinessPostForm from "@/app/shops/post-form";

export default async function AdminBusinessPost({ searchParams }: { searchParams: Promise<{ shop?: string }> }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (user.app_metadata?.role !== "admin") redirect("/account");
  const { shop: shopId } = await searchParams;
  if (!shopId) notFound();
  const supabase = await createClient();
  const { data: shop } = await supabase.from("shops").select("id,name,owner_id,is_active").eq("id", shopId).maybeSingle();
  if (!shop?.is_active) notFound();
  return <main className="min-h-screen bg-[#eef1f4]"><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/admin">Admin dashboard</Link></div></header><div className="shell page-shell max-w-3xl"><span className="kicker">APG assistance</span><h1 className="page-title">Post for {shop.name}</h1><p className="mt-3 text-slate-600">Only publish photos and details the business approved for APG. The business can remove this post from its profile.</p><BusinessPostForm shopId={shop.id} ownerId={shop.owner_id} uploaderId={user.id}/></div></main>;
}
