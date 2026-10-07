import { AwarenessBanner, AskGearControl } from "@/components/october-awareness";
import Link from "next/link";
import Image from "next/image";
import { Package, Store, ArrowRight } from "lucide-react";
import { getUser } from "@/lib/auth";
import { LegacyMarketplaceHashRedirect } from "./marketplace/legacy-hash-redirect";
import NotificationBell from "@/components/notification-bell";
import InstallApp from "./install-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getUser();
  const postPath = user ? "/sell" : "/login?next=/sell";
  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <LegacyMarketplaceHashRedirect />
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-24 max-w-7xl items-center gap-1 px-3 sm:gap-3 sm:px-6">
        <Link href="/" aria-label="Any-Part and Gear home" className="mr-auto"><Image src="/apg-home-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={1983} height={793} priority className="h-auto w-[130px] sm:w-[190px]" /></Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex"><Link href="/marketplace" className="font-bold">Marketplace</Link><Link href="/shops" className="font-bold">Businesses &amp; Shops</Link><Link href="/about" className="font-bold">About</Link></nav>
        <div className="hidden xl:block"><InstallApp /></div>
        {user && <NotificationBell userId={user.id} />}
        <Link href={postPath} className="apg-home-cta inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-black sm:px-5 sm:text-base">Post an item</Link>
        <details className="group relative">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-2xl hover:bg-slate-100 [&::-webkit-details-marker]:hidden" aria-label="Menu">☰</summary>
          <nav aria-label="Main menu" className="absolute right-0 top-full z-50 mt-2 grid w-56 gap-1 rounded-xl border border-slate-200 bg-white p-2 text-sm font-semibold shadow-xl">
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/marketplace">Browse Marketplace</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href={postPath}>Post an item</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/shops">Parts &amp; Repair Directory</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/parts-wanted">Parts Wanted</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/tech-wire">APG Tech Wire</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/links">APG Links</Link>
            <AskGearControl className="rounded-lg px-3 py-2 text-left hover:bg-slate-100" />
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/toolbox">APG Toolbox</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/garage-gear">Garage Gear</Link>
            {user ? <><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/account">My account</Link><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/messages">Messages</Link><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/notifications">Notifications</Link><a className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/auth/signout">Sign out</a></> : <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/login">Sign in or create account</Link>}
          </nav>
        </details>
      </div>
    </header>
    <AwarenessBanner />
    <section className="apg-home-hero relative isolate overflow-hidden text-white">
      <Image src="/apg-marketplace-hero.webp" alt="Transmission, gears, tools, and a marine propeller on a workshop bench" fill priority sizes="100vw" className="-z-20 object-cover object-[65%_center]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#03152b]/95 via-[#03152b]/70 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
        <h1 className="max-w-xl text-6xl font-black leading-[.98] tracking-[-.04em] sm:text-8xl">Post it.<br /><span className="apg-home-accent">Sell it.</span></h1>
        <p className="mt-5 max-w-lg text-xl leading-8 text-slate-200 sm:text-2xl">A growing marketplace for parts, tools, and gear.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link href={postPath} className="apg-home-cta inline-flex min-h-14 items-center justify-center gap-3 rounded-lg px-7 text-lg font-black">List an item <ArrowRight aria-hidden="true" size={22} /></Link><Link href="/shops" className="apg-home-outline inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border-2 bg-[#03152b]/50 px-6 text-lg font-bold hover:bg-[#03152b]/80">Browse local shops <ArrowRight aria-hidden="true" size={22} /></Link></div>
      </div>
    </section>
    <section aria-label="Explore APG" className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4"><span className="apg-home-icon rounded-full p-4"><Package size={30} aria-hidden="true" /></span><div><h2 className="text-2xl font-black">Individual Marketplace</h2><p className="mt-1 text-slate-600">Listings from individual sellers.</p></div></div>
        <div className="py-8 text-center"><Package className="mx-auto mb-4 text-slate-300" size={70} strokeWidth={1} aria-hidden="true" /><h3 className="text-2xl font-black">Help get the marketplace started.</h3><p className="mx-auto mt-3 max-w-md text-slate-600">Post what you have, or explore what people have listed.</p><Link href={postPath} className="apg-home-cta mt-5 inline-flex min-h-12 items-center gap-3 rounded-lg px-6 font-black">Post your first item <ArrowRight size={20} aria-hidden="true" /></Link><div className="mt-4"><Link href="/marketplace" className="font-bold underline underline-offset-4">Browse individual listings</Link></div></div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4"><span className="apg-home-icon rounded-full p-4"><Store size={30} aria-hidden="true" /></span><div><h2 className="text-2xl font-black">Businesses &amp; Shops</h2><p className="mt-1 text-slate-600">See what local shops have to offer.</p></div></div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5"><h3 className="text-xl font-black">Explore local business pages</h3><p className="mt-3 leading-7 text-slate-600">Find parts suppliers and repair shops. Visit each business’s page to see its services and any inventory it has posted.</p><Link href="/shops" className="apg-home-outline mt-4 inline-flex min-h-12 items-center gap-3 rounded-lg border-2 px-5 font-bold">View business pages <ArrowRight size={20} aria-hidden="true" /></Link></div>
        <Link href="/shops/register" className="mt-6 flex min-h-12 items-center gap-4 font-bold"><Store size={25} aria-hidden="true" /><span>Own a business?<span className="block text-sm font-normal text-slate-600">Create your business page.</span></span><ArrowRight className="ml-auto" size={20} aria-hidden="true" /></Link>
      </div>
    </section>
    <footer className="bg-[#06162d] px-4 py-8 text-sm text-slate-300"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3"><strong className="mr-auto text-white">ANY-PART &amp; GEAR</strong><Link href="/about" className="hover:text-white">About Us</Link><a href="/APG.vcf" download="APG.vcf" className="font-bold text-amber-400 hover:text-amber-300">Save APG Contact</a><Link href="/trust" className="hover:text-white">Trust &amp; Transparency</Link><Link href="/safety" className="hover:text-white">Safety</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/privacy" className="hover:text-white">Privacy</Link></div></footer>
  </main>;
}
