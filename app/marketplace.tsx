"use client";
import styles from "./marketplace-design.module.css";
import SiteHeader from "@/components/site-header";
import { AwarenessBanner } from "@/components/october-awareness";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Anchor, Bike, Car, Drill, Factory, Gamepad2, Heart, MapPin, PackageOpen, Search, Share2, ShieldCheck, Shirt, Tag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { getSubaruParts } from "@/lib/part-out";
import SellerBadges from "@/components/seller-badges";

type Listing = { id: number | string; title: string; description: string; price: number; category: string; condition: string; location: string; seller: string; contactEmail?: string; contactPhone?: string; status?: string; imageUrl?: string | null; imageUrls?: string[]; year?: string; make?: string; model?: string; engine?: string; mileageHours?: string; transmission?: string; partNumber?: string; brand?: string; size?: string; color?: string; quantity?: string; emailVerified?: boolean; trustedSeller?: boolean; verifiedBusiness?: boolean; badge?: string; tone?: string };

const categories = [
  { name: "Car Parts", icon: Car, detail: "Engines, body & more" }, { name: "Boat Parts", icon: Anchor, detail: "Marine parts & gear" },
  { name: "Motorcycles", icon: Bike, detail: "Street, dirt & touring" }, { name: "Machinery", icon: Factory, detail: "Heavy equipment parts" },
  { name: "Tools", icon: Drill, detail: "Shop & jobsite tools" }, { name: "Vehicles for Sale", icon: Truck, detail: "Cars, trucks & equipment" },
  { name: "Boats for Sale", icon: Anchor, detail: "Complete boats & watercraft" }, { name: "Trailers", icon: Truck, detail: "Utility, boat & cargo" },
  { name: "RC & Hobby", icon: Gamepad2, detail: "RC vehicles, drones & upgrades" },
  { name: "Workwear & Apparel", icon: Shirt, detail: "Work clothes & safety gear" },
  { name: "Other", icon: PackageOpen, detail: "Everything in between" },
];

const categoryIcons: Record<string, typeof Car> = { "Car Parts": Car, "Boat Parts": Anchor, "Boats for Sale": Anchor, Motorcycles: Bike, Trucks: Truck, Machinery: Factory, Trailers: Truck, Tools: Drill, "RC & Hobby": Gamepad2, "Workwear & Apparel": Shirt, Other: PackageOpen, "Vehicles for Sale": Truck };


function ListingCard({ item, liked, toggle }: { item: Listing; liked: boolean; toggle: () => void }) {
  const [opening, setOpening] = useState(false);
  const parts = getSubaruParts(item);
  const Icon=categoryIcons[item.category]||PackageOpen;
  const share=()=>{const url=`${window.location.origin}/listing/${item.id}`;if(navigator.share){void navigator.share({title:item.title,url});}else{void navigator.clipboard.writeText(url).then(()=>toast.success("Listing link copied."));}};
  return <article className={styles.card}>
    <div className={styles.photo}>
      <Link href={`/listing/${item.id}`} className={styles.photoLink} aria-label={`View ${parts ? "Subaru Parts" : item.title}`}>
        {item.imageUrl ? <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw" className="object-cover"/> : <span className={styles.placeholder}><Icon aria-hidden="true"/><span>{item.category}</span></span>}
      </Link>
      <button type="button" onClick={toggle} className={styles.favorite} aria-pressed={liked} aria-label={liked?"Remove from favorites":"Save to favorites"}><Heart className={liked?"fill-amber-400 text-amber-400":""}/></button>
    </div>
    <div className={styles.cardBody}>
      <strong className={parts ? styles.partsPrice : styles.price}>{parts ? "Prices in description" : `$${item.price.toLocaleString()}`}</strong>
      <h3 className={styles.title}><Link href={`/listing/${item.id}`}>{parts ? "Subaru Parts" : item.title}</Link></h3>
      <p className={styles.location}><MapPin aria-hidden="true"/>{item.location}</p>
      <div className={styles.seller}><span>{item.seller}</span><SellerBadges emailVerified={item.emailVerified} trustedSeller={item.trustedSeller} verifiedBusiness={item.verifiedBusiness}/></div>
      <div className={styles.cardActions}><Link className={styles.details} href={`/listing/${item.id}`} onClick={()=>setOpening(true)} aria-busy={opening}>{opening ? "Opening…" : "View & contact seller"}</Link><button type="button" className={styles.share} aria-label={`Share ${item.title}`} onClick={share}><Share2 aria-hidden="true"/></button></div>
    </div>
  </article>;
}

export default function Marketplace({ user, signInPath, signOutPath, listings, locations, initialLocation, initialQuery, initialCategory, initialSort }: { user: { id: string; name: string; email: string } | null; signInPath: string; signOutPath: string; listings: Listing[]; locations: string[]; initialLocation: string; initialQuery: string; initialCategory: string; initialSort: string }) {
  const [query, setQuery] = useState(initialQuery); const [category, setCategory] = useState(initialCategory); const [sort, setSort] = useState(initialSort);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const all = listings;
  const shown = useMemo(() => {
    let values = all.filter(x => (category === "All" || x.category === category) && `${x.title} ${x.description} ${x.seller}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === "Price low") values = [...values].sort((a,b)=>a.price-b.price);
    if (sort === "Price high") values = [...values].sort((a,b)=>b.price-a.price);
    return values;
  }, [all, query, category, sort]);
  const runSearch = (e: React.FormEvent) => { e.preventDefault(); document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }); };

  useEffect(() => {
    function searchFromGears(event: Event) {
      const detail = (event as CustomEvent<{ query?: string }>).detail;
      if (!detail.query) return;
      setQuery(detail.query);
      setCategory("All");
      document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
    }
    window.addEventListener("apg:search", searchFromGears);
    return () => window.removeEventListener("apg:search", searchFromGears);
  }, []);

  return <main className={`${styles.marketplace} min-h-screen text-slate-950`}>
    <Toaster richColors position="top-center" />
    <SiteHeader signedIn={Boolean(user)} current="marketplace" signInPath={signInPath} signOutPath={signOutPath} />
    <AwarenessBanner />

    <section className={styles.discovery} aria-labelledby="marketplace-title"><div className={styles.container}>
      <div className={styles.headingRow}><div><p className={styles.eyebrow}>APG Marketplace</p><h1 id="marketplace-title">Marketplace</h1></div><Link className={styles.sellButton} href={user ? "/sell" : "/login?next=/sell"}><Tag aria-hidden="true"/>Post a Listing</Link></div>
      <form onSubmit={runSearch} className={styles.search}><Search aria-hidden="true"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search parts, tools & vehicles" aria-label="Search listings"/><button type="submit">Search</button></form>
      <nav className={styles.categories} aria-label="Listing categories"><button type="button" aria-pressed={category === "All"} onClick={()=>setCategory("All")}>All</button>{categories.map(c=><button type="button" key={c.name} aria-pressed={category === c.name} onClick={()=>setCategory(c.name)}><c.icon aria-hidden="true"/>{c.name}</button>)}</nav>
    </div></section>

    <section id="listings" className={styles.listings}><div className={styles.resultsRow}><div><h2>Latest listings</h2><p aria-live="polite">{shown.length} {shown.length === 1 ? "listing" : "listings"} found</p></div><div className={styles.filters}><form action="/marketplace#listings"><input type="hidden" name="q" value={query}/><input type="hidden" name="category" value={category}/><input type="hidden" name="sort" value={sort}/><label className="sr-only" htmlFor="marketplace-location">City or town</label><select id="marketplace-location" name="location" defaultValue={initialLocation} onChange={event => event.currentTarget.form?.requestSubmit()}><option value="">All locations</option>{locations.map(place => <option key={place} value={place}>{place}</option>)}</select></form><label className="sr-only" htmlFor="marketplace-sort">Sort listings</label><select id="marketplace-sort" value={sort} onChange={event=>setSort(event.target.value)}>{["Newest","Price low","Price high"].map(value=><option key={value}>{value}</option>)}</select></div></div>
      {shown.length ? <div className={styles.grid}>{shown.map(item=><ListingCard key={item.id} item={item} liked={favorites.has(item.id)} toggle={()=>setFavorites(prev=>{const next=new Set(prev);if(next.has(item.id)){next.delete(item.id);}else{next.add(item.id);}return next})}/>)}</div>:<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center"><PackageOpen className="mx-auto size-10 text-slate-400"/><h3 className="mt-4 text-xl font-bold">{all.length ? "No parts found" : "No listings yet"}</h3><p className="mt-2 text-slate-500">{all.length ? "Try a different search, category or location." : "Be the first to post an item on Any Part & Gear."}</p>{!all.length&&<Button asChild className="gold-button mt-6 h-11 px-6 font-black"><a href={user?"/sell":"/login?next=/sell"}><Tag className="size-4"/> Post the first item</a></Button>}</div>}
    </section>


    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6" aria-labelledby="parts-wanted-home-title"><div className="flex flex-col gap-5 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><p className="eyebrow">Can’t find it?</p><h2 id="parts-wanted-home-title" className="mt-1 text-2xl font-black text-[#071a35]">Tell local businesses what you need.</h2><p className="mt-2 max-w-2xl leading-6 text-slate-600">Post a Parts Wanted request and let verified local businesses help locate or identify it.</p></div><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><Button asChild variant="outline" className="h-11 px-5 font-bold"><Link href="/parts-wanted">How it works</Link></Button><Button asChild className="gold-button h-11 px-6 font-black"><Link href={user?"/parts-wanted/new":"/login?next=/parts-wanted/new"}><Search className="size-4"/> Request a part</Link></Button></div></div></section>


    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6"><div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><ShieldCheck className="mt-1 size-5 shrink-0"/><p><strong>Transactions happen directly between buyer and seller.</strong> Any Part and Gear only provides classified listings. We do not process payments, arrange shipping, guarantee fitment, or handle returns. Verify the item and seller before paying.</p></div></section>

    <footer className="bg-[#06162d] text-slate-400"><div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 text-sm sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:items-center"><span className="font-bold text-white">ANY PART <b className="text-amber-400">& GEAR</b></span><div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-center"><a href="/terms" className="hover:text-white">Terms</a><a href="/privacy" className="hover:text-white">Privacy</a><a href="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</a><a href="/community-guidelines" className="hover:text-white">Community Guidelines</a><a href="/trust" className="hover:text-white">Trust &amp; Transparency</a><a href="/support" className="hover:text-white">Support</a><a href="/safety" className="hover:text-white">Safety</a><Link href="/about" className="hover:text-white">About Us</Link></div><div className="flex flex-wrap items-center gap-4"><a href="https://www.facebook.com/share/1GRGa1eFPK/" target="_blank" rel="noopener noreferrer" aria-label="APG on Facebook" className="inline-flex size-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:bg-[#0f67d8]"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-white" fill="currentColor"><path d="M13.6 22v-8h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.7-1.6H17V4.4c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.1H7.3V14h2.8v8h3.5Z"/></svg></a><a href="https://www.instagram.com/apgmarketplace/" target="_blank" rel="noopener noreferrer" aria-label="APG on Instagram" className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white transition hover:brightness-110"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a href="https://www.linkedin.com/company/any-part-and-gear/" target="_blank" rel="noopener noreferrer" aria-label="APG on LinkedIn" className="inline-flex size-9 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:bg-[#084f96]"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.86H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.26Z"/></svg></a><p>© 2026 Any-Part and Gear LLC</p>{user&&<a href={signOutPath} target="_top" className="hover:text-white">Sign out</a>}</div></div></footer>
  </main>;
}
