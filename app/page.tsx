import Image from "next/image";
import Link from "next/link";
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
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-1 px-3 sm:gap-3 sm:px-6">
        <Link href="/" aria-label="Any-Part and Gear home" className="mr-auto"><Image src="/apg-logo.webp" alt="A.P.G. Any-Part & Gear LLC" width={172} height={50} priority className="h-auto w-[112px] sm:w-[172px]" /></Link>
        <div className="hidden sm:block"><InstallApp /></div>
        {user && <NotificationBell userId={user.id} />}
        <Link href="/marketplace" className="gold-button inline-flex h-11 items-center rounded-lg px-2 text-sm font-black sm:px-5 sm:text-base">Marketplace</Link>
        <details className="group relative">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-2xl hover:bg-slate-100 [&::-webkit-details-marker]:hidden" aria-label="Menu">☰</summary>
          <nav aria-label="Main menu" className="absolute right-0 top-full z-50 mt-2 grid w-56 gap-1 rounded-xl border border-slate-200 bg-white p-2 text-sm font-semibold shadow-xl">
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/marketplace">Browse Marketplace</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href={postPath}>Post an item</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/shops">Parts &amp; Repair Directory</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/parts-wanted">Parts Wanted</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/tech-wire">APG Tech Wire</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/links">APG Links</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/toolbox">APG Toolbox</Link>
            <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/garage-gear">Garage Gear</Link>
            {user ? <><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/account">My account</Link><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/messages">Messages</Link><Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/notifications">Notifications</Link><a className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/auth/signout">Sign out</a></> : <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" href="/login">Sign in or create account</Link>}
          </nav>
        </details>
      </div>
    </header>
    <section className="mech-hero relative overflow-hidden text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-[-.04em] sm:text-6xl">Need a part?<br />Need a shop?<br /><span className="text-amber-400">Start local.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-7 text-slate-300">Find nearby parts, businesses, and people who can help.</p>
        <div className="mt-6 space-y-1 text-base leading-7 text-slate-100" aria-label="Ask for what you need. Post what you have. Get connected locally."><p><span className="font-black text-amber-400">A</span>sk for what you need.</p><p><span className="font-black text-amber-400">P</span>ost what you have.</p><p><span className="font-black text-amber-400">G</span>et connected locally.</p></div>
        <p className="mt-6 font-semibold text-slate-300">Together, we can find it.</p>
        <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"><Link href="/marketplace" className="gold-button inline-flex min-h-12 flex-1 items-center justify-center rounded-lg px-6 text-center font-black">Browse Marketplace →</Link><Link href={postPath} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-400 px-6 font-bold text-white hover:bg-white/10">Post an item</Link></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><h2 className="text-2xl font-black">What is APG?</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Any-Part and Gear is a growing marketplace where people and businesses can post parts, gear, vehicles, and services. Listings and shop profiles vary by area as members join.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/shops" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold hover:border-amber-400">Find parts &amp; repair services</Link><Link href="/parts-wanted" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold hover:border-amber-400">Request a part</Link></div></section>
    <footer className="bg-[#06162d] px-4 py-8 text-sm text-slate-300"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3"><strong className="mr-auto text-white">ANY-PART &amp; GEAR</strong><Link href="/about" className="hover:text-white">About Us</Link><a href="/APG.vcf" download="APG.vcf" className="font-bold text-amber-400 hover:text-amber-300">Save APG Contact</a><Link href="/trust" className="hover:text-white">Trust &amp; Transparency</Link><Link href="/safety" className="hover:text-white">Safety</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/privacy" className="hover:text-white">Privacy</Link></div></footer>
  </main>;
}
