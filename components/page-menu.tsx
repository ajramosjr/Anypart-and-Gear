"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const destinations = [
  ["/", "Home"], ["/marketplace", "Marketplace"],
  ["/shops", "Repair Shops & Parts Suppliers"], ["/garage-gear", "Tools & Work Gear"],
  ["/sell", "Post an Item"], ["/jobs", "Jobs & Opportunities"],
  ["/parts-wanted", "Parts Wanted"], ["/how-things-work.html", "How Things Work"],
  ["/toolbox", "APG Toolbox"], ["/practice-tests", "Practice Tests"],
  ["/links", "Courses & Training"], ["/shout-outs", "APG Shout-Outs"],
  ["/account", "My Account"], ["/about", "About APG"], ["/safety", "Safety"]
];
export default function PageMenu() {
  const path = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => { if (ref.current) ref.current.open = false; };
  return <><Link href="/garage-gear" className="apg-header-gear no-print">Tools &amp; Work Gear</Link><details className="apg-page-menu no-print" ref={ref} onKeyDown={e => { if (e.key === "Escape") { close(); ref.current?.querySelector("summary")?.focus(); } }}>
    <summary aria-label="Main menu">Menu ☰</summary>
    <nav aria-label="Main menu">{destinations.filter(([href]) => href !== path).map(([href, label]) => <Link key={href} href={href} onClick={close}>{label}</Link>)}</nav>
  </details></>;
}
