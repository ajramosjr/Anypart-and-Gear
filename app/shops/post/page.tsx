import Link from "next/link";
import { redirect } from "next/navigation";
import ApgLogo from "@/components/apg-logo";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import BusinessPostForm from "../post-form";

export default async function PostBusinessPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/shops/post");
  const supabase = await createClient();
  const { data: shop } = await supabase.from("shops").select("id,name").eq("owner_id", user.id).eq("is_active", true).maybeSingle();
  return <main className="min-h-screen bg-[#eef1f4]"><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/shops">Businesses</Link></div></header><div className="shell page-shell max-w-3xl">
    {shop ? <><span className="kicker">{shop.name}</span><h1 className="page-title">New business post</h1><BusinessPostForm shopId={shop.id} ownerId={user.id}/></> : <div className="empty-state"><h1 className="page-title">Create your business profile first</h1><p>Once your profile is ready, you can share a photo and note here.</p><Link className="button mt-5" href="/shops/register">Create a business profile</Link></div>}
  </div></main>;
}
