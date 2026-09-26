import type { Metadata } from "next";
import Link from "next/link";
import ApgLogo from "@/components/apg-logo";
import ToolboxClient from "./toolbox-client";
import "./toolbox.css";

export const metadata: Metadata = {
  title: "APG Toolbox | Workshop Charts & Calculators",
  description: "Free workshop charts, calculators and printable references for mechanics, builders and DIYers.",
};

export default function ToolboxPage() {
  return (
    <main className="toolbox-page">
      <header className="toolbox-header no-print">
        <div className="shell nav-wrap">
          <ApgLogo priority />
          <nav className="toolbox-nav" aria-label="Main navigation">
            <Link href="/">Marketplace</Link>
            <Link href="/shops">Local shops</Link>
            <Link href="/tech-wire">APG Tech Wire</Link>
            <Link className="active" href="/toolbox">Toolbox</Link>
          </nav>
          <Link className="button button-small" href="/sell">Sell</Link>
        </div>
      </header>
      <ToolboxClient />
    </main>
  );
}
