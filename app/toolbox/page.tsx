import PageMenu from "@/components/page-menu";
import type { Metadata } from "next";
import Link from "next/link";
import { TechWireLink } from "@/components/tech-wire-navigation";
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

  return (
    <main className="toolbox-page">
      <header className="simple-header sell-header dashboard-header no-print">
        <div className="shell nav-wrap">
          <ApgLogo priority />
          <nav className="account-nav" aria-label="Main navigation">
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/shops">Repair Shops &amp; Parts Suppliers</Link>
            <TechWireLink href="/tech-wire">APG Tech Wire</TechWireLink>
            <Link href="/links">Courses &amp; Training</Link>
            <Link href="/sell">Post an Item</Link>

          </nav>
        <PageMenu /></div>
      </header>
      <ToolboxClient canPrint={Boolean(user)} />
    </main>
  );
}
