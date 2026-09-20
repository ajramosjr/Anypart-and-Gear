import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import EditForm from "./edit-form";
import ApgLogo from "@/components/apg-logo";

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/listing/${id}/edit`);
  const supabase = await createClient();
  const { data } = await supabase.from("listings").select("id,title,description,price,condition,category,location,trade,allow_offers,image_url,image_urls,video_url").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) notFound();
  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href={`/listing/${id}`}>Cancel editing</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Seller tools</span><h1 className="page-title">Edit listing</h1><p>Update the title, description, price and item details shown to buyers.</p></div><div className="card-panel"><EditForm listing={data} userId={user.id} /></div></div></main>;
}
