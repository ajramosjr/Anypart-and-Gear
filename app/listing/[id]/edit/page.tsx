import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import EditForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/listing/${id}/edit`);
  const supabase = await createClient();
  const { data } = await supabase.from("listings").select("id,title,description,price,condition,category,location,trade").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) notFound();
  return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href={`/listing/${id}`}>Cancel editing</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Seller tools</span><h1 className="page-title">Edit listing</h1><p>Update the title, description, price and item details shown to buyers.</p></div><div className="card-panel"><EditForm listing={data} /></div></div></main>;
}
