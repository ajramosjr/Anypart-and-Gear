"use client";
import { SeasonalLogo } from "@/components/october-awareness";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Anchor, Bike, Car, ChevronDown, Drill, Factory, Gamepad2, Heart, LayoutDashboard, LoaderCircle, Mail, MapPin, Menu, PackageOpen, Phone, Search, Share2, ShieldCheck, Shirt, SlidersHorizontal, Tag, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import InstallApp from "./install-app";
import SellerBadges from "@/components/seller-badges";
import NotificationBell from "@/components/notification-bell";

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
  const Icon=categoryIcons[item.category]||PackageOpen;
  const share=()=>{const url=`${window.location.origin}/listing/${item.id}`;if(navigator.share){void navigator.share({title:item.title,url});}else{void navigator.clipboard.writeText(url).then(()=>toast.success("Listing link copied."));}};
  return <article className="listing-card group">
    <div className={`listing-visual bg-gradient-to-br ${item.tone||"from-blue-900 to-amber-500"}`}>
      {item.imageUrl?<Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover"/>:<><Icon className="size-20 text-white/90"/><span>{item.category}</span></>}
      <button onClick={toggle} className="favorite" aria-label={liked?"Remove from favorites":"Save to favorites"}><Heart className={liked?"fill-amber-400 text-amber-400":""}/></button>
      <span className="condition">{item.condition}</span>{item.badge&&<span className="listing-badge">{item.badge}</span>}
    </div>
    <div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-extrabold leading-6"><a href={`/listing/${item.id}`} className="hover:text-amber-700">{item.title}</a></h3><strong className="text-xl text-blue-950">${item.price.toLocaleString()}</strong></div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>
      <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-sm font-bold">{item.seller}</p><SellerBadges emailVerified={item.emailVerified} trustedSeller={item.trustedSeller} verifiedBusiness={item.verifiedBusiness}/><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3"/>{item.location}</p>
        <div className="mt-4 flex flex-wrap gap-2">{item.contactPhone&&<Button asChild size="sm" variant="outline"><a href={`tel:${item.contactPhone}`}><Phone className="size-4"/> Call</a></Button>}{item.contactEmail&&<Button asChild size="sm" variant="outline"><a href={`mailto:${item.contactEmail}?subject=${encodeURIComponent(item.title)}`}><Mail className="size-4"/> Email</a></Button>}{!item.contactEmail&&!item.contactPhone&&<Button size="sm" variant="outline" onClick={()=>toast.info(`Contact ${item.seller} about this listing.`)}>Contact seller</Button>}</div>
      </div>
      <div className="mt-3 flex gap-2"><Button asChild className="gold-button h-11 flex-1 font-black"><Link href={`/listing/${item.id}`} onClick={()=>setOpening(true)} aria-busy={opening}>{opening?<><LoaderCircle className="size-4 animate-spin"/> Opening…</>:<>View details</>}</Link></Button><Button size="icon" variant="outline" className="h-11 w-11" aria-label="Share listing" onClick={share}><Share2 className="size-4"/></Button></div>
    </div>
  </article>;
}

export default function Marketplace({ user, signInPath, signOutPath, listings }: { user: { id: string; name: string; email: string } | null; signInPath: string; signOutPath: string; listings: Listing[] }) {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All"); const [sort, setSort] = useState("Newest");
  const [mobileNav, setMobileNav] = useState(false); const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
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

  return <main className="mechanical-shell min-h-screen bg-[#eef1f4] text-slate-950">
    <Toaster richColors position="top-center" />
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 2xl:gap-6">
        <Link href="/" className="apg-brand" aria-label="Any-Part and Gear home"><SeasonalLogo alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} className="apg-brand-logo" priority /></Link>
        <nav className="ml-auto hidden items-center gap-4 text-sm font-semibold 2xl:flex"><a href="#listings">Marketplace</a><Link href="/shops">Parts &amp; Repair Directory</Link><Link href="/parts-wanted">Parts Wanted</Link><Link href="/tech-wire">Tech Wire</Link><details className="group relative"><summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-2 py-2 hover:bg-slate-100">More <ChevronDown className="size-4 transition group-open:rotate-180"/></summary><div className="absolute right-0 top-full z-50 mt-2 grid min-w-52 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/toolbox">APG Toolbox</Link><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/garage-gear">Garage Gear</Link><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/links">APG Links</Link><a className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/safety">Safety tips</a></div></details></nav>
        <div className="ml-auto flex min-w-0 items-center gap-2 2xl:ml-2"><InstallApp/>{user&&<NotificationBell userId={user.id}/>} {user?<Button asChild variant="ghost" className="hidden text-slate-900 hover:bg-slate-100 sm:inline-flex"><a href="/account"><LayoutDashboard className="size-4"/> My listings</a></Button>:<Button asChild variant="ghost" className="hidden text-slate-900 hover:bg-slate-100 sm:inline-flex"><a href={signInPath}>Sign in</a></Button>}<Button asChild className="gold-button h-11 px-3 text-sm font-bold sm:px-5 sm:text-base"><a href={user?"/sell":"/login?next=/sell"}><Tag className="size-4"/> <span className="sm:hidden">Post</span><span className="hidden sm:inline">Post an item</span></a></Button><Button variant="ghost" size="icon" className="text-slate-900 2xl:hidden" onClick={()=>setMobileNav(!mobileNav)} aria-label="Menu">{mobileNav?<X/>:<Menu/>}</Button></div>
      </div>
      {mobileNav && <nav className="grid gap-1 border-t border-slate-200 px-4 py-3 text-sm font-semibold 2xl:hidden"><a className="rounded-lg p-3 hover:bg-slate-100" href="#listings">Browse listings</a><Link className="rounded-lg p-3 hover:bg-slate-100" href="/parts-wanted">Parts Wanted</Link><Link className="rounded-lg p-3 hover:bg-slate-100" href="/shops">Parts &amp; Repair Directory</Link><Link className="rounded-lg p-3 hover:bg-slate-100" href="/tech-wire">APG Tech Wire</Link><Link className="rounded-lg p-3 hover:bg-slate-100" href="/links">APG Links</Link><Link className="rounded-lg p-3 hover:bg-slate-100" href="/toolbox">APG Toolbox</Link><Link className="rounded-lg p-3 hover:bg-slate-100" href="/garage-gear">Garage Gear</Link><a className="rounded-lg p-3 hover:bg-slate-100" href="/safety">Safety tips</a>{user?<><a className="rounded-lg p-3 hover:bg-slate-100" href="/account">My account</a><a className="rounded-lg p-3 hover:bg-slate-100" href="/messages">Messages</a><a className="rounded-lg p-3 hover:bg-slate-100" href="/notifications">Notifications</a><a className="rounded-lg p-3 text-red-700 hover:bg-red-50" href={signOutPath}>Sign out</a></>:<a className="rounded-lg border border-amber-500 bg-amber-400 p-3 text-center font-extrabold text-[#071a35] shadow-sm hover:bg-amber-300" href={signInPath}>Sign in or create account</a>}</nav>}
    </header>

    <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"><p className="eyebrow">APG Marketplace</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Browse Marketplace</h1><p className="mt-3 text-slate-600">Search individual sellers’ listings, choose a category, or sort by price. Find business pages in the Parts & Repair Directory.</p>
      <form onSubmit={runSearch} className="mt-6 flex max-w-3xl flex-col gap-2 rounded-xl border border-slate-300 bg-white p-2 sm:flex-row"><div className="flex flex-1 items-center gap-3 px-3"><Search className="size-5 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-12 w-full bg-transparent text-base text-slate-900 outline-none" placeholder="Search parts, brands, model numbers…" aria-label="Search listings"/></div><Button className="gold-button h-12 px-7 font-black">Search</Button></form>
    </div></section>

    <section id="listings" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6"><div className="mb-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Browse APG</p><h2 className="section-title">Latest listings</h2><p className="mt-2 text-slate-500">{shown.length} listings found</p></div><div className="flex gap-2"><Select value={category} onValueChange={setCategory}><SelectTrigger className="h-11 w-40 bg-white"><SlidersHorizontal className="size-4"/><SelectValue/></SelectTrigger><SelectContent><SelectItem value="All">All categories</SelectItem>{categories.map(c=><SelectItem value={c.name} key={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><Select value={sort} onValueChange={setSort}><SelectTrigger className="h-11 w-36 bg-white"><SelectValue/></SelectTrigger><SelectContent>{["Newest","Price low","Price high"].map(s=><SelectItem value={s} key={s}>{s}</SelectItem>)}</SelectContent></Select></div></div>
      {shown.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map(item=><ListingCard key={item.id} item={item} liked={favorites.has(item.id)} toggle={()=>setFavorites(prev=>{const next=new Set(prev);if(next.has(item.id)){next.delete(item.id);}else{next.add(item.id);}return next})}/>)}</div>:<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center"><PackageOpen className="mx-auto size-10 text-slate-400"/><h3 className="mt-4 text-xl font-bold">{all.length ? "No parts found" : "No listings yet"}</h3><p className="mt-2 text-slate-500">{all.length ? "Try a different search or category." : "Be the first to post an item on Any Part & Gear."}</p>{!all.length&&<Button asChild className="gold-button mt-6 h-11 px-6 font-black"><a href={user?"/sell":"/login?next=/sell"}><Tag className="size-4"/> Post the first item</a></Button>}</div>}
    </section>


    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6" aria-labelledby="parts-wanted-home-title"><div className="flex flex-col gap-5 rounded-2xl border border-slate-300 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><p className="eyebrow">Can’t find it?</p><h2 id="parts-wanted-home-title" className="mt-1 text-2xl font-black text-[#071a35]">Tell local businesses what you need.</h2><p className="mt-2 max-w-2xl leading-6 text-slate-600">Post a Parts Wanted request and let verified local businesses help locate or identify it.</p></div><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><Button asChild variant="outline" className="h-11 px-5 font-bold"><Link href="/parts-wanted">How it works</Link></Button><Button asChild className="gold-button h-11 px-6 font-black"><Link href={user?"/parts-wanted/new":"/login?next=/parts-wanted/new"}><Search className="size-4"/> Request a part</Link></Button></div></div></section>


    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6"><div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><ShieldCheck className="mt-1 size-5 shrink-0"/><p><strong>Transactions happen directly between buyer and seller.</strong> Any Part and Gear only provides classified listings. We do not process payments, arrange shipping, guarantee fitment, or handle returns. Verify the item and seller before paying.</p></div></section>

    <footer className="bg-[#06162d] text-slate-400"><div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 text-sm sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:items-center"><span className="font-bold text-white">ANY PART <b className="text-amber-400">& GEAR</b></span><div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-center"><a href="/terms" className="hover:text-white">Terms</a><a href="/privacy" className="hover:text-white">Privacy</a><a href="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</a><a href="/community-guidelines" className="hover:text-white">Community Guidelines</a><a href="/trust" className="hover:text-white">Trust &amp; Transparency</a><a href="/support" className="hover:text-white">Support</a><a href="/safety" className="hover:text-white">Safety</a><Link href="/about" className="hover:text-white">About Us</Link></div><div className="flex flex-wrap items-center gap-4"><a href="https://www.facebook.com/share/1GRGa1eFPK/" target="_blank" rel="noopener noreferrer" aria-label="APG on Facebook" className="inline-flex size-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:bg-[#0f67d8]"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-white" fill="currentColor"><path d="M13.6 22v-8h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.7-1.6H17V4.4c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.1H7.3V14h2.8v8h3.5Z"/></svg></a><a href="https://www.instagram.com/apgmarketplace/" target="_blank" rel="noopener noreferrer" aria-label="APG on Instagram" className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white transition hover:brightness-110"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a href="https://www.linkedin.com/company/any-part-and-gear/" target="_blank" rel="noopener noreferrer" aria-label="APG on LinkedIn" className="inline-flex size-9 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:bg-[#084f96]"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.86H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.26Z"/></svg></a><p>© 2026 Any-Part and Gear LLC</p>{user&&<a href={signOutPath} target="_top" className="hover:text-white">Sign out</a>}</div></div></footer>
  </main>;
}
