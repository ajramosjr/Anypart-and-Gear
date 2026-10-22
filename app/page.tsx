import "server-only";
import SiteHeader from "@/components/site-header";
import { AwarenessBanner } from "@/components/october-awareness";
import Link from "next/link";
import Image from "next/image";
import { Package, Store, BookOpen, ArrowRight } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { LegacyMarketplaceHashRedirect } from "./marketplace/legacy-hash-redirect";
import { getCommunityState } from "@/lib/community";

export const dynamic = "force-dynamic";

async function getLatestListings() {
  if (!hasSupabaseConfig()) return { listings: [], unavailable: false };
  const supabase = await createClient();
  const { data, error } = await supabase.from("listings")
    .select("id,title,price,category,location,image_url")
    .eq("status", "active").is("shop_id", null)
    .order("created_at", { ascending: false }).limit(4);
  if (error) { console.error("Homepage listings unavailable:", error.code); return { listings: [], unavailable: true }; }
  return { listings: data ?? [], unavailable: false };
}

export default async function Home() {
  const [user, { listings, unavailable }, community] = await Promise.all([getUser(), getLatestListings(), getCommunityState()]);
  const postPath = user ? "/sell" : "/login?next=/sell";
  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <LegacyMarketplaceHashRedirect />
    <SiteHeader signedIn={Boolean(user)} current="home" communityEnabled={community.enabled} />
    <AwarenessBanner />
    {!user && <section aria-label="Member access" className="bg-[#06162d] px-4 py-4 text-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3"><p><strong>Browse APG. Join when you’re ready.</strong> Explore listings, shops and resources. Sign in to post, message sellers or print Toolbox resources.</p><Link href="/login?access=members" className="apg-home-cta inline-flex min-h-11 items-center rounded-lg px-5 font-bold">Sign up or log in</Link></div></section>}
    <section className="apg-home-hero apg-mobile-hero relative isolate overflow-hidden text-white">
      <Image src="/apg-marketplace-hero.webp" alt="Transmission, gears, tools, and a marine propeller on a workshop bench" fill priority sizes="100vw" className="-z-20 object-cover object-[65%_center]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#03152b]/95 via-[#03152b]/70 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-[-.04em] sm:text-6xl">Have parts sitting around gathering dust? <span className="apg-home-accent">Post it here.</span></h1>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-200 sm:text-xl">A growing marketplace for parts, tools, and gear.</p>
        <div className="apg-home-actions mt-5 flex flex-wrap gap-3"><Link href={postPath} className="apg-home-cta inline-flex min-h-14 items-center justify-center gap-3 rounded-lg px-7 text-lg font-black">Post a Listing <ArrowRight aria-hidden="true" size={22} /></Link><Link href="/marketplace" className="apg-home-outline inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border-2 bg-[#03152b]/50 px-6 text-lg font-bold hover:bg-[#03152b]/80">Browse Marketplace <ArrowRight aria-hidden="true" size={22} /></Link></div>
      </div>
    </section>
    <section className="apg-explore shell" aria-labelledby="explore-title">
      <h2 id="explore-title">Explore APG</h2>
      <div className="apg-explore-grid">
        {[
          {title:"Marketplace",href:"/marketplace",icon:Package,description:"Buy & sell parts, tools and vehicles"},
          {title:"Shops & Suppliers",href:"/shops",icon:Store,description:"Find repair shops and parts suppliers"},
          {title:"Toolbox",href:"/toolbox",icon:BookOpen,description:"Charts, calculators and repair references"},
        ].map(({title,href,icon:Icon,description}) => <Link href={href} key={href} className="apg-explore-card">
          <div className="flex aspect-[1.8] items-center justify-center border-b border-slate-200 bg-[#e7edf3] max-sm:aspect-[1.4]">
            <Icon aria-hidden="true" className="text-[#071a35]" style={{width:"clamp(32px, 6vw, 64px)",height:"clamp(32px, 6vw, 64px)",color:"#071a35"}} strokeWidth={1.5}/>
          </div>
          <span>{title}<ArrowRight size={18} aria-hidden="true"/></span>
          <p className="px-2 pb-4 text-xs leading-relaxed text-slate-600 sm:px-4 sm:text-sm">{description}</p>
        </Link>)}
      </div>
    </section>
    <section aria-labelledby="individual-marketplace-title" className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 id="individual-marketplace-title" className="text-2xl sm:text-3xl font-black">Latest Listings</h2><p className="mt-2 text-slate-600">Recent listings from individual sellers.</p></div><Link href="/marketplace" className="inline-flex min-h-11 items-center gap-2 font-bold">View all listings <ArrowRight size={20} aria-hidden="true" /></Link></div>
      {listings.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{listings.map((listing) => <Link key={listing.id} href={`/listing/${listing.id}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-pink-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600">
        <div className="relative aspect-[4/3] bg-slate-100">{listing.image_url ? <Image src={listing.image_url} alt={listing.title} fill sizes="(max-width: 1023px) 50vw, 320px" className="object-cover transition-transform group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Package size={48} className="text-slate-400" aria-hidden="true" /><span className="sr-only">No photo provided</span></div>}</div>
        <div className="p-3 sm:p-4"><h3 className="line-clamp-2 font-extrabold">{listing.title}</h3><p className="mt-1 truncate text-sm text-slate-500">{listing.category}</p><strong className="mt-3 block text-xl">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(listing.price))}</strong><p className="mt-1 truncate text-sm text-slate-500">{listing.location}</p></div>
      </Link>)}</div> : <div className="mt-5 rounded-xl border border-slate-200 bg-white px-6 py-8 text-center"><Package className="mx-auto mb-3 text-slate-300" size={48} strokeWidth={1} aria-hidden="true" /><h3 className="text-2xl font-black">{unavailable ? "Browse the individual marketplace" : "Help get the marketplace started."}</h3><p className="mt-3 text-slate-600">{unavailable ? "Listings are temporarily unavailable here. Try the marketplace or check back shortly." : "Have parts, tools, or gear? Post an item to help the marketplace grow."}</p><Link href={unavailable ? "/marketplace" : postPath} className="apg-home-cta mt-5 inline-flex min-h-12 items-center gap-3 rounded-lg px-6 font-black">{unavailable ? "Browse marketplace" : "Post your first item"} <ArrowRight size={20} aria-hidden="true" /></Link></div>}
    </section>
    <section aria-label="Repair shops and parts suppliers" className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 sm:pb-7">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-8">
        <div className="flex items-center gap-4"><span className="apg-home-icon rounded-full p-3 sm:p-4"><Store size={30} aria-hidden="true" /></span><div><h2 className="text-xl font-black sm:text-2xl">Repair Shops &amp; Parts Suppliers</h2><p className="mt-1 text-slate-600">Explore local repair shops, local parts suppliers, and online suppliers.</p></div></div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5"><h3 className="text-xl font-black">Explore the directory</h3><p className="mt-3 leading-7 text-slate-600">Find parts suppliers and repair shops. Visit each business’s page to see its services and any inventory it has posted.</p><Link href="/shops" className="apg-home-outline mt-4 inline-flex min-h-12 items-center gap-3 rounded-lg border-2 px-5 font-bold">Browse the directory <ArrowRight size={20} aria-hidden="true" /></Link></div>
        <Link href="/shops/register" className="mt-6 flex min-h-12 items-center gap-4 font-bold"><Store size={25} aria-hidden="true" /><span>Own a repair shop or supply business?<span className="block text-sm font-normal text-slate-600">Add your shop or supplier profile.</span></span><ArrowRight className="ml-auto" size={20} aria-hidden="true" /></Link>
      </div>
    </section>
    <footer className="bg-[#06162d] px-4 py-8 text-sm text-slate-300"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3"><strong className="mr-auto text-white">ANY-PART &amp; GEAR</strong><Link href="/about" className="hover:text-white">About Us</Link><a href="/APG.vcf" download="APG.vcf" className="font-bold text-amber-400 hover:text-amber-300">Save APG Contact</a><Link href="/trust" className="hover:text-white">Trust &amp; Transparency</Link><Link href="/safety" className="hover:text-white">Safety</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/privacy" className="hover:text-white">Privacy</Link></div></footer>
  </main>;
}
