import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ShoutOut } from "@/lib/shout-outs";
import ApgLogo from "@/components/apg-logo";
import ShoutOutEditor from "./editor";
export const dynamic = "force-dynamic";

export default async function AdminShoutOuts({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string; error?: string }> }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin/shout-outs");
  if (user.app_metadata?.role !== "admin") redirect("/account");
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("shout_outs").select("id,name,description,website_url,image_url,status,updated_at").order("updated_at", { ascending: false });
  const items = (data || []) as ShoutOut[];
  const selected = items.find(item => item.id === params.edit);
  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/admin">Admin dashboard</Link></div></header>
    <div className="shell py-10 pb-32"><span className="kicker">Owner controls</span><h1 className="mt-3 text-4xl font-black">APG Shout-Outs Editor</h1><p className="mt-4 text-slate-600">Share websites, businesses and people you appreciate. Drafts and previews are visible only to administrators.</p>
      <div className="mt-5 flex flex-wrap gap-5"><Link href="/admin/shout-outs" className="font-bold underline">New shout-out</Link><Link href="/shout-outs" className="font-bold underline">View public page</Link></div>
      {params.saved && <p role="status" className="mt-5 text-green-800">{params.saved === "published" ? "Shout-out published." : params.saved === "removed" ? "Shout-out removed from the public page. It can be restored below." : "Draft saved."}</p>}
      {(params.error || error) && <p role="alert" className="mt-5 text-red-800">{params.error === "invalid" ? "Add a name, description and valid website link. Image links must use http or https." : "The shout-outs could not be loaded or saved. Please try again."}</p>}
      <div className="mt-6 grid gap-3">{items.map(item => <Link key={item.id} href={"/admin/shout-outs?edit=" + item.id} className="flex min-h-14 items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-3"><strong>{item.name}</strong><span className="text-sm font-bold capitalize">{item.status === "archived" ? "Removed" : item.status} · Edit</span></Link>)}</div>
      <ShoutOutEditor key={selected?.id || "new"} item={selected} />
    </div>
  </main>;
}
