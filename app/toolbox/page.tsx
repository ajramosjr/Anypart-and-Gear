import type { Metadata } from "next";
import Link from "next/link";
import { TechWireLink } from "@/components/tech-wire-navigation";
import { redirect } from "next/navigation";
import ApgLogo from "@/components/apg-logo";
import { getUser } from "@/lib/auth";
import ToolboxClient from "./toolbox-client";
import "./toolbox.css";

export const metadata: Metadata = {
  title: "APG Toolbox | Workshop Charts & Calculators",
  description: "Free workshop charts, calculators and printable references for mechanics, builders and DIYers.",
};

export default async function ToolboxPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/toolbox");

  return (
    <main className="toolbox-page">
      <header className="simple-header sell-header dashboard-header no-print">
        <div className="shell nav-wrap">
          <ApgLogo priority />
          <nav className="account-nav" aria-label="Main navigation">
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/shops">Shops &amp; Suppliers</Link>
            <TechWireLink href="/tech-wire">APG Tech Wire</TechWireLink>
            <Link href="/links">Courses &amp; Training</Link>
            <Link href="/sell">Post an item</Link>
            <details className="dashboard-menu">
              <summary>Menu</summary>
              <div className="dashboard-menu-links">
                <Link href="/marketplace">Marketplace</Link>
                <Link href="/shops">Shops &amp; Suppliers</Link>
                <TechWireLink href="/tech-wire">APG Tech Wire</TechWireLink>
                <Link href="/links">Courses &amp; Training</Link>
                <Link href="/sell">Post an item</Link>
              </div>
            </details>
          </nav>
        </div>
      </header>
      <ToolboxClient />
    </main>
  );
}
