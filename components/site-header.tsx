"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, ClipboardList, Menu, MessageSquare, Package, Store, Tag, UserRound, X } from "lucide-react";
import ApgLogo from "@/components/apg-logo";
import { TechWireLink } from "@/components/tech-wire-navigation";
import { BuildIdeasLink } from "@/components/build-ideas-navigation";
import InstallApp from "@/app/install-app";

type SiteHeaderProps = {
  signedIn?: boolean;
  current?: "home" | "marketplace" | "gear";
  communityEnabled?: boolean;
  signInPath?: string;
  signOutPath?: string;
};

const rowClass = "flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600";
const childClass = "flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-amber-600";

export default function SiteHeader({ signedIn = false, current = "home", communityEnabled = false, signInPath = "/login", signOutPath = "/auth/signout" }: SiteHeaderProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (menuRef.current) menuRef.current.open = false; };
  return <header className="apg-site-header sticky top-0 z-40 border-b border-slate-200 bg-white text-[#071a35]">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6">
      <div className="mr-auto shrink-0 [&_a]:!p-0 [&_img]:!h-auto [&_img]:!w-[100px] sm:[&_img]:!w-[172px]"><ApgLogo priority /></div>
      <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm font-bold xl:flex">
        <Link href="/marketplace" aria-current={current === "marketplace" ? "page" : undefined}>Marketplace</Link>
        <Link href="/shops">Shops &amp; Suppliers</Link>
        <Link href="/about">About</Link>
      </nav>
      <Link href="/garage-gear" aria-current={current === "gear" ? "page" : undefined} className="apg-header-control flex min-h-11 max-w-[132px] shrink-0 items-center justify-center rounded-lg border border-[#c79522] px-3 py-2 text-center text-xs font-bold text-[#071a35] sm:max-w-none sm:text-sm">Tools &amp; Work Gear</Link>
      <details ref={menuRef} className="group relative shrink-0" onKeyDown={event => { if (event.key === "Escape") { closeMenu(); menuRef.current?.querySelector("summary")?.focus(); } }}>
        <summary aria-label="Main menu" className="apg-header-control flex size-11 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-slate-100 [&::-webkit-details-marker]:hidden"><Menu className="size-6 group-open:hidden" aria-hidden="true" /><X className="hidden size-6 group-open:block" aria-hidden="true" /></summary>
        <nav aria-label="Main menu" onClick={event => { if ((event.target as HTMLElement).closest("a")) closeMenu(); }} className="absolute right-0 top-full z-50 mt-3 grid max-h-[calc(100dvh-110px)] w-80 max-w-[calc(100vw-32px)] gap-1 overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-3 text-[#071a35] shadow-xl">
          <Link href="/marketplace" aria-current={current === "marketplace" ? "page" : undefined} className={rowClass}><Package size={20} aria-hidden="true" />Marketplace<ArrowRight size={16} className="ml-auto text-[#a77c16]" aria-hidden="true" /></Link>
          <Link href={signedIn ? "/sell" : "/login?next=/sell"} className={rowClass}><Tag size={20} aria-hidden="true" />Post an Item<ArrowRight size={16} className="ml-auto text-[#a77c16]" aria-hidden="true" /></Link>
          <Link href="/shops" className={rowClass}><Store size={20} aria-hidden="true" />Shops &amp; Suppliers<ArrowRight size={16} className="ml-auto text-[#a77c16]" aria-hidden="true" /></Link>
          <Link href="/parts-wanted" className={rowClass}><ClipboardList size={20} aria-hidden="true" />Parts Wanted<ArrowRight size={16} className="ml-auto text-[#a77c16]" aria-hidden="true" /></Link>
          <details className="border-t border-slate-200 pt-2">
            <summary className={rowClass + " cursor-pointer list-none [&::-webkit-details-marker]:hidden"}><BookOpen size={20} aria-hidden="true" />Learn &amp; Resources<ChevronDown size={18} className="ml-auto" aria-hidden="true" /></summary>
            <div className="grid gap-1 pl-9">
              <Link className={childClass} href="/how-things-work.html">How Things Work</Link>
              <Link className={childClass} href="/toolbox">APG Toolbox</Link>
              <BuildIdeasLink className={childClass} href="/build-ideas">APG Build Ideas</BuildIdeasLink>
              <Link className={childClass} href="/practice-tests">Practice Tests</Link>
              <Link className={childClass} href="/links">Courses &amp; Training</Link>
              <Link className={childClass} href="/shout-outs">APG Shout-Outs</Link>
              <TechWireLink className={childClass} href="/tech-wire">Parts &amp; Industry News</TechWireLink>
              <Link className={childClass} href="/safety">Safety tips</Link>
            </div>
          </details>
          {signedIn ? <details className="border-t border-slate-200 pt-2">
            <summary className={rowClass + " cursor-pointer list-none [&::-webkit-details-marker]:hidden"}><UserRound size={20} aria-hidden="true" />My Account<ChevronDown size={18} className="ml-auto" aria-hidden="true" /></summary>
            <div className="grid gap-1 pl-9">
              <Link href="/account" className={childClass}>My listings &amp; account</Link>
              <Link href="/messages" className={childClass}>Messages</Link>
              <Link href="/notifications" className={childClass}>Notifications</Link>
              <a href={signOutPath} className={childClass}>Sign out</a>
            </div>
          </details> : <Link href={signInPath} className={rowClass + " border-t border-slate-200"}><UserRound size={20} aria-hidden="true" />Sign in or create account</Link>}
          <Link href="/community" className={rowClass}><MessageSquare size={20} aria-hidden="true" /><span>APG Community{!communityEnabled && <span className="ml-2 text-xs text-amber-800">Coming Soon</span>}</span></Link>
          <div className="border-t border-slate-200 px-3 pt-3"><InstallApp /></div>
          <Link href="/about" className={childClass}>About APG</Link>
        </nav>
      </details>
    </div>
  </header>;
}
