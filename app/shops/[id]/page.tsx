import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock3, ExternalLink, MapPin, PackageOpen, Store, Wrench } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";
import ContactShop from "../contact-shop";

export const dynamic = "force-dynamic";

type Shop = {
  id: string;
  owner_id: string;
  name: string;
  specialty: string;
  description: string;
  location: string;
  postal_code: string;
  hours: string;
  website: string | null;
  services: string[];
  is_verified: boolean;
};

type ShopListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  location: string;
  image_url: string | null;
  created_at: string;
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

export default async function ShopProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, getUser()]);
  const supabase = await createClient();
  const { data: shopData } = await supabase
    .from("shops")
    .select("id,owner_id,name,specialty,description,location,postal_code,hours,website,services,is_verified")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!shopData) notFound();
  const shop = shopData as Shop;

  const { data: listingData } = await supabase
    .from("listings")
    .select("id,title,description,price,condition,category,location,image_url,created_at")
    .eq("user_id", shop.owner_id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const listings = (listingData || []) as ShopListing[];
  const website = safeWebsite(shop.website);

  return <main className="min-h-screen bg-[#eef1f4]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><div className="account-nav"><Link href="/shops">Local shops</Link><Link href="/">Marketplace</Link></div></div></header>

    <section className="bg-[#071a35] text-white">
      <div className="shell py-12">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3"><span className="grid size-14 place-items-center rounded-lg bg-amber-400 text-[#071a35]"><Store className="size-7"/></span>{shop.is_verified && <span className="verified-badge business-badge"><BadgeCheck className="size-3"/> Verified business</span>}</div>
            <h1 className="mt-5 text-4xl font-black sm:text-5xl">{shop.name}</h1>
            <p className="mt-2 flex items-center gap-2 font-bold text-amber-300"><Wrench className="size-4"/>{shop.specialty}</p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{shop.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {website && <a className="button" href={website} target="_blank" rel="noopener noreferrer nofollow"><ExternalLink size={17}/> Visit Business Website</a>}
            <ContactShop shopId={shop.id} ownerId={shop.owner_id} currentUserId={user?.id} nextPath={`/shops/${shop.id}`}/>
          </div>
        </div>
      </div>
    </section>

    <div className="shell page-shell">
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <span className="flex items-center gap-3 text-slate-700"><MapPin className="size-5 text-amber-700"/><strong>{shop.location} · {shop.postal_code}</strong></span>
        <span className="flex items-center gap-3 text-slate-700"><Clock3 className="size-5 text-amber-700"/><strong>{shop.hours}</strong></span>
        {shop.services.length > 0 && <div className="flex flex-wrap gap-2 sm:col-span-2">{shop.services.map((service) => <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700" key={service}>{service}</span>)}</div>}
      </section>

      <section className="mt-12">
        <div className="mb-6"><span className="kicker">APG inventory</span><h2 className="page-title">Items from {shop.name}</h2><p className="mt-2 text-slate-600">{listings.length} active {listings.length === 1 ? "listing" : "listings"}</p></div>
        {listings.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{listings.map((listing) => <article className="listing-card" key={listing.id}>
          <div className="listing-visual bg-gradient-to-br from-blue-950 to-slate-700">
            {listing.image_url ? <Image src={listing.image_url} alt={listing.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover"/> : <><PackageOpen className="size-16 text-amber-300"/><span>{listing.category}</span></>}
            <span className="condition">{listing.condition}</span>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-extrabold leading-6">{listing.title}</h3><strong className="text-xl text-blue-950">${Number(listing.price).toLocaleString()}</strong></div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{listing.description}</p>
            <p className="mt-4 flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3"/>{listing.location}</p>
            <Link className="button mt-5 w-full" href={`/listing/${listing.id}`}>View item</Link>
          </div>
        </article>)}</div> : <div className="empty-state"><PackageOpen className="mx-auto mb-3"/><h3>No active APG listings</h3><p>Visit the business website or send the shop a private message about its inventory.</p>{website && <a className="button mt-5" href={website} target="_blank" rel="noopener noreferrer nofollow">Visit Business Website</a>}</div>}
      </section>
    </div>
  </main>;
}
