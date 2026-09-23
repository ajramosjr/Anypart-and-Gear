"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Anchor, Bike, BookOpen, Car, ChevronRight, CirclePlay, Drill, Factory, FileSpreadsheet, Gamepad2, Heart, LayoutDashboard, Mail, MapPin, Menu, PackageOpen, Phone, Search, Share2, ShieldCheck, Shirt, SlidersHorizontal, Store, Tag, Truck, Upload, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import InstallApp from "./install-app";
import SellerBadges from "@/components/seller-badges";
import { amazonSearchUrl } from "@/lib/affiliate";

type Listing = { id: number | string; title: string; description: string; price: number; category: string; condition: string; location: string; seller: string; contactEmail?: string; contactPhone?: string; status?: string; imageUrl?: string | null; imageUrls?: string[]; year?: string; make?: string; model?: string; engine?: string; mileageHours?: string; transmission?: string; partNumber?: string; brand?: string; size?: string; color?: string; quantity?: string; emailVerified?: boolean; trustedSeller?: boolean; verifiedBusiness?: boolean; badge?: string; tone?: string };

const categories = [
  { name: "Car Parts", icon: Car, detail: "Engines, body & more" }, { name: "Boat Parts", icon: Anchor, detail: "Marine parts & gear" },
  { name: "Boats for Sale", icon: Anchor, detail: "Complete boats & watercraft" },
  { name: "Motorcycles", icon: Bike, detail: "Street, dirt & touring" }, { name: "Machinery", icon: Factory, detail: "Heavy equipment parts" },
  { name: "Trailers", icon: Truck, detail: "Utility, boat & cargo" },
  { name: "Tools", icon: Drill, detail: "Shop & jobsite tools" }, { name: "Other", icon: PackageOpen, detail: "Everything in between" },
  { name: "RC & Hobby", icon: Gamepad2, detail: "RC vehicles, drones & upgrades" },
  { name: "Workwear & Apparel", icon: Shirt, detail: "Work clothes & safety gear" },
  { name: "Vehicles for Sale", icon: Truck, detail: "Cars, trucks & equipment" },
];

const categoryIcons: Record<string, typeof Car> = { "Car Parts": Car, "Boat Parts": Anchor, "Boats for Sale": Anchor, Motorcycles: Bike, Trucks: Truck, Machinery: Factory, Trailers: Truck, Tools: Drill, "RC & Hobby": Gamepad2, "Workwear & Apparel": Shirt, Other: PackageOpen, "Vehicles for Sale": Truck };


const recommendedGear = [
  { title: "OBD-II scanners", detail: "Read check-engine codes and begin diagnosing warning lights.", query: "automotive OBD2 scanner", icon: Search },
  { title: "Mechanic's tool sets", detail: "Sockets, ratchets and hand tools for common repair work.", query: "mechanics tool set automotive", icon: Wrench },
  { title: "Portable jump starters", detail: "Compact emergency power for cars, trucks and recreational vehicles.", query: "portable car battery jump starter", icon: ShieldCheck },
  { title: "Torque wrenches", detail: "Tighten wheels and components to the correct specification.", query: "automotive torque wrench", icon: Drill },
];

function ListingCard({ item, liked, toggle }: { item: Listing; liked: boolean; toggle: () => void }) {
  const Icon=categoryIcons[item.category]||PackageOpen;
  const helpQuery=encodeURIComponent(`how to install repair ${item.title}`);
  const manualQuery=`${item.title} service repair manual`;
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
        <div className="mt-3 grid grid-cols-2 gap-2"><Button asChild size="sm" variant="secondary"><a href={`https://www.youtube.com/results?search_query=${helpQuery}`} target="_blank" rel="noopener noreferrer"><CirclePlay className="size-4"/> Repair help</a></Button><Button asChild size="sm" variant="secondary"><a href={amazonSearchUrl(manualQuery)} target="_blank" rel="noopener noreferrer sponsored nofollow"><BookOpen className="size-4"/> Find manuals</a></Button></div>
        <p className="mt-2 text-[11px] leading-4 text-slate-500">As an Amazon Associate I earn from qualifying purchases. <Link href="/affiliate-disclosure" className="underline hover:text-slate-700">Learn more</Link></p>
      </div>
      <div className="mt-3 flex gap-2"><Button asChild className="flex-1"><a href={`/listing/${item.id}`}>View details</a></Button><Button size="icon" variant="outline" aria-label="Share listing" onClick={share}><Share2 className="size-4"/></Button></div>
    </div>
  </article>;
}

export default function Marketplace({ user, signInPath, signOutPath, listings }: { user: { name: string; email: string } | null; signInPath: string; signOutPath: string; listings: Listing[] }) {
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

  return <main className="mechanical-shell min-h-screen bg-[#eef1f4] text-slate-950">
    <Toaster richColors position="top-center" />
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <a href="#" className="apg-brand" aria-label="Any-Part and Gear home"><Image src="/apg-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} className="apg-brand-logo" priority /></a>
        <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold lg:flex"><a href="#listings">Browse</a><a href="#categories">Categories</a><a href="/shops">Local shops</a><Link href="/tech-wire">Tech Wire</Link><a href="/safety">Safety tips</a><a href="#business">For businesses</a></nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-2"><InstallApp/>{user?<Button asChild variant="ghost" className="hidden text-slate-900 hover:bg-slate-100 sm:inline-flex"><a href="/account"><LayoutDashboard className="size-4"/> My listings</a></Button>:<Button asChild variant="ghost" className="hidden text-slate-900 hover:bg-slate-100 sm:inline-flex"><a href={signInPath}>Sign in</a></Button>}<Button asChild className="gold-button h-11 px-5 font-bold"><a href={user?"/sell":"/login?next=/sell"}><Tag className="size-4"/> <span className="hidden sm:inline">Post an item</span><span className="sm:hidden">Sell</span></a></Button><Button variant="ghost" size="icon" className="text-slate-900 lg:hidden" onClick={()=>setMobileNav(!mobileNav)} aria-label="Menu">{mobileNav?<X/>:<Menu/>}</Button></div>
      </div>
      {mobileNav && <nav className="grid gap-1 border-t border-slate-200 px-4 py-3 text-sm font-semibold lg:hidden"><a className="rounded-lg p-3 hover:bg-slate-100" href="#listings">Browse listings</a><a className="rounded-lg p-3 hover:bg-slate-100" href="#categories">Categories</a><a className="rounded-lg p-3 hover:bg-slate-100" href="/shops">Local shops</a><Link className="rounded-lg p-3 hover:bg-slate-100" href="/tech-wire">APG Tech Wire</Link><a className="rounded-lg p-3 hover:bg-slate-100" href="/safety">Safety tips</a><a className="rounded-lg p-3 hover:bg-slate-100" href="#business">For businesses</a>{user?<><a className="rounded-lg p-3 hover:bg-slate-100" href="/account">My account</a><a className="rounded-lg p-3 hover:bg-slate-100" href="/messages">Messages</a><a className="rounded-lg p-3 text-red-700 hover:bg-red-50" href={signOutPath}>Sign out</a></>:<a className="rounded-lg border border-amber-500 bg-amber-400 p-3 text-center font-extrabold text-[#071a35] shadow-sm hover:bg-amber-300" href={signInPath}>Sign in or create account</a>}</nav>}
    </header>

    <section className="hero-grid mech-hero overflow-hidden bg-[#071a35] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div><h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-.04em] sm:text-6xl lg:text-7xl">Parts. Gear.<br/><span className="text-amber-400">Vehicles.</span></h1><p className="mt-6 max-w-xl text-xl leading-8 text-slate-300">Buy and sell what keeps you moving.</p>
          <form onSubmit={runSearch} className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 sm:flex-row"><div className="flex flex-1 items-center gap-3 px-3"><Search className="size-5 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-12 w-full bg-transparent text-base text-slate-900 outline-none" placeholder="Search parts, brands, model numbers…" aria-label="Search listings"/></div><Button className="gold-button h-12 px-7 font-black">Search</Button></form>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300"><span className="flex items-center gap-2"><Store className="size-4 text-amber-400"/> Buy directly from sellers</span><span className="flex items-center gap-2"><MapPin className="size-4 text-amber-400"/> Local pickup or seller-arranged shipping</span></div>
        </div>
        <div className="hidden lg:block"><div className="parts-orbit"><div className="orbit-core"><Wrench className="size-16"/><span>ANY JOB</span></div>{categories.slice(0,5).map((c,i)=><div key={c.name} className={`orbit-item orbit-${i+1}`}><c.icon/><span>{c.name}</span></div>)}</div></div>
      </div>
    </section>

    <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div className="mb-6 flex items-end justify-between"><div><p className="eyebrow">Shop by category</p><h2 className="section-title">What are you looking for?</h2></div><button onClick={()=>setCategory("All")} className="hidden items-center gap-1 text-sm font-bold text-blue-900 sm:flex">View all <ChevronRight className="size-4"/></button></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{categories.map(c=><button key={c.name} onClick={()=>{setCategory(c.name);document.getElementById("listings")?.scrollIntoView({behavior:"smooth"})}} className="category-card text-left"><span className="category-icon"><c.icon/></span><strong>{c.name}</strong><small>{c.detail}</small></button>)}</div></section>


    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6" aria-labelledby="recommended-gear-title">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">New tools and gear</p><h2 id="recommended-gear-title" className="section-title">Recommended for the garage</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Useful starting points from Amazon, kept separate from used marketplace listings.</p></div>
          <Link href="/affiliate-disclosure" className="text-sm font-bold text-blue-900 underline decoration-amber-400 underline-offset-4">How affiliate links work</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedGear.map(({ title, detail, query: gearQuery, icon: Icon }) => <article key={title} className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5">
            <span className="mb-4 grid size-11 place-items-center rounded-lg bg-[#071a35] text-amber-400"><Icon className="size-5"/></span>
            <h3 className="font-extrabold text-slate-950">{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{detail}</p>
            <Button asChild className="gold-button mt-5 w-full font-black"><a href={amazonSearchUrl(gearQuery)} target="_blank" rel="noopener noreferrer sponsored nofollow">Shop on Amazon</a></Button>
          </article>)}
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500"><strong>Affiliate disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Amazon controls pricing, availability, shipping and returns.</p>
      </div>
    </section>

    <section id="listings" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6"><div className="mb-6 flex flex-col gap-4 border-t border-slate-200 pt-10 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Fresh inventory</p><h2 className="section-title">Parts worth grabbing</h2><p className="mt-2 text-slate-500">{shown.length} listings found</p></div><div className="flex gap-2"><Select value={category} onValueChange={setCategory}><SelectTrigger className="h-11 w-40 bg-white"><SlidersHorizontal className="size-4"/><SelectValue/></SelectTrigger><SelectContent><SelectItem value="All">All categories</SelectItem>{categories.map(c=><SelectItem value={c.name} key={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><Select value={sort} onValueChange={setSort}><SelectTrigger className="h-11 w-36 bg-white"><SelectValue/></SelectTrigger><SelectContent>{["Newest","Price low","Price high"].map(s=><SelectItem value={s} key={s}>{s}</SelectItem>)}</SelectContent></Select></div></div>
      {shown.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{shown.map(item=><ListingCard key={item.id} item={item} liked={favorites.has(item.id)} toggle={()=>setFavorites(prev=>{const next=new Set(prev);if(next.has(item.id)){next.delete(item.id);}else{next.add(item.id);}return next})}/>)}</div>:<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center"><PackageOpen className="mx-auto size-10 text-slate-400"/><h3 className="mt-4 text-xl font-bold">{all.length ? "No parts found" : "No listings yet"}</h3><p className="mt-2 text-slate-500">{all.length ? "Try a different search or category." : "Be the first to post an item on Any Part & Gear."}</p>{!all.length&&<Button asChild className="gold-button mt-6 h-11 px-6 font-black"><a href={user?"/sell":"/login?next=/sell"}><Tag className="size-4"/> Post the first item</a></Button>}</div>}
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6"><div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><ShieldCheck className="mt-1 size-5 shrink-0"/><p><strong>Transactions happen directly between buyer and seller.</strong> Any Part and Gear only provides classified listings. We do not process payments, arrange shipping, guarantee fitment, or handle returns. Verify the item and seller before paying.</p></div></section>

    <section id="business" className="bg-[#0b2345] text-white"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="eyebrow text-amber-400">Simple for parts businesses</p><h2 className="mt-2 max-w-3xl text-3xl font-black sm:text-4xl">Post one item or upload your whole inventory.</h2><div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-300"><span className="flex items-center gap-2"><Store className="size-4 text-amber-400"/> Buyers contact you directly</span><span className="flex items-center gap-2"><Upload className="size-4 text-amber-400"/> Up to 100 active listings per business account</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-amber-400"/> You control payment and delivery</span></div></div><div className="flex flex-col gap-3 sm:flex-row"><Button asChild variant="outline" className="h-11 border-amber-400 bg-transparent text-amber-300 hover:bg-white/10 hover:text-white"><a href={user?"/sell/bulk":"/login?next=/sell/bulk"}><FileSpreadsheet className="size-4"/> Bulk upload</a></Button><Button asChild className="gold-button h-11 px-5 font-bold"><a href={user?"/sell":"/login?next=/sell"}><Tag className="size-4"/> Post an item</a></Button></div></div></section>
    <footer className="bg-[#06162d] text-slate-400"><div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 text-sm sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:items-center"><span className="font-bold text-white">ANY PART <b className="text-amber-400">& GEAR</b></span><div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-center"><a href="/terms" className="hover:text-white">Terms</a><a href="/privacy" className="hover:text-white">Privacy</a><a href="/affiliate-disclosure" className="hover:text-white">Affiliate Disclosure</a><a href="/community-guidelines" className="hover:text-white">Community Guidelines</a><a href="/support" className="hover:text-white">Support</a><a href="/safety" className="hover:text-white">Safety</a></div><div className="flex gap-4"><p>© 2026 Any Part and Gear</p>{user&&<a href={signOutPath} target="_top" className="hover:text-white">Sign out</a>}</div></div></footer>
  </main>;
}
