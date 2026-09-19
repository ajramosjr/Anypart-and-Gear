import Link from "next/link";
import { BadgeCheck, Clock3, MapPin, Search, Store, Wrench } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ContactShop from "./contact-shop";
import ApgLogo from "@/components/apg-logo";

type Shop = {
  id: string; owner_id: string; name: string; specialty: string; description: string;
  location: string; postal_code: string; hours: string; website: string | null;
  services: string[]; is_verified: boolean;
};

function safeWebsite(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function ShopsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ q = "" }, user] = await Promise.all([searchParams, getUser()]);
  const supabase = await createClient();
  const { data } = await supabase.from("shops").select("id,owner_id,name,specialty,description,location,postal_code,hours,website,services,is_verified").eq("is_active", true).order("is_verified", { ascending: false }).order("name");
  const needle = q.trim().toLowerCase();
  const shops = ((data || []) as Shop[]).filter((shop) => !needle || [shop.name, shop.specialty, shop.description, shop.location, shop.postal_code, ...shop.services].join(" ").toLowerCase().includes(needle));

  return <main className="min-h-screen bg-[#eef1f4]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><div className="account-nav"><Link href="/messages">Messages</Link><Link href="/">Marketplace</Link></div></div></header>
    <section className="bg-[#071a35] text-white"><div className="shell py-14"><span className="kicker text-amber-400">Local parts network</span><h1 className="mt-2 text-4xl font-black sm:text-5xl">Shops near you</h1><p className="mt-3 max-w-2xl text-slate-300">Find parts stores, repair shops, salvage yards and specialists. Ask about a part without sharing your private contact information.</p>
      <form className="mt-7 flex max-w-2xl gap-2" action="/shops"><div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-3"><Search className="size-5 text-slate-400"/><input className="h-12 w-full text-slate-950 outline-none" name="q" defaultValue={q} placeholder="Search specialty, city or ZIP code" /></div><button className="button">Search</button></form>
    </div></section>
    <div className="shell page-shell">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><span className="kicker">{shops.length} local businesses</span><h2 className="page-title">Local shops</h2></div><Link className="button" href={user ? "/shops/register" : "/login?next=/shops/register"}><Store size={17}/> Add your business</Link></div>
      {shops.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{shops.map((shop) => <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" key={shop.id}>
        <div className="flex items-start justify-between gap-3"><span className="grid size-12 place-items-center rounded-lg bg-amber-100 text-amber-800"><Store/></span>{shop.is_verified && <span className="verified-badge"><BadgeCheck className="size-3"/> Verified</span>}</div>
        <h2 className="mt-4 text-xl font-black text-[#071a35]">{shop.name}</h2><p className="mt-1 flex items-center gap-2 text-sm font-bold text-amber-700"><Wrench className="size-4"/>{shop.specialty}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{shop.description}</p>
        <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600"><span className="flex items-center gap-2"><MapPin className="size-4"/>{shop.location} · {shop.postal_code}</span><span className="flex items-center gap-2"><Clock3 className="size-4"/>{shop.hours}</span></div>
        {shop.services.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{shop.services.map((service) => <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700" key={service}>{service}</span>)}</div>}
        <div className="mt-5 flex flex-wrap gap-2">{safeWebsite(shop.website) && <a className="button button-small button-secondary" href={safeWebsite(shop.website)!} target="_blank" rel="noopener noreferrer">Website</a>}<ContactShop shopId={shop.id} ownerId={shop.owner_id} currentUserId={user?.id}/></div>
      </article>)}</div> : <div className="empty-state"><Store className="mx-auto mb-3"/><h3>No shops found yet</h3><p>Try another city or ZIP code, or add the first local business.</p></div>}
    </div>
  </main>;
}
