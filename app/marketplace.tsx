"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, ChevronRight, Heart, MapPin, Menu, Search, ShieldCheck, Sparkles, Store, Wrench, X } from "lucide-react";
import { categories, Listing } from "@/lib/data";

type MarketplaceProps = { user: { name: string; email: string } | null; listings: Listing[] };
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Marketplace({ user, listings }: MarketplaceProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("apg-favorites");
    const timer = window.setTimeout(() => {
      if (stored) setFavorites(JSON.parse(stored));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleListings = useMemo(() => {
    const term = query.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesCategory = activeCategory === "All" || listing.category === activeCategory;
      const haystack = `${listing.title} ${listing.description} ${listing.category} ${listing.location}`.toLowerCase();
      return matchesCategory && (!term || haystack.includes(term));
    });
  }, [activeCategory, listings, query]);

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
    setFavorites(next);
    window.localStorage.setItem("apg-favorites", JSON.stringify(next));
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseCategory(category: string) {
    setActiveCategory(category);
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link href="/" className="brand" aria-label="Anypart and Gear home">
            <span className="brand-mark">APG</span>
            <span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span>
          </Link>
          <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
            <a href="#categories" onClick={() => setMenuOpen(false)}>Browse categories</a>
            <Link href="/safety" onClick={() => setMenuOpen(false)}>Safety tips</Link>
            <a href="#business" onClick={() => setMenuOpen(false)}>For businesses</a>
            {user ? <><span className="welcome">Hi, {user.name}</span><a href="/auth/signout">Sign out</a></> : <Link href="/login">Sign in</Link>}
            <Link className="button button-small" href={user ? "/sell" : "/login?next=/sell"}>{user ? "Sell an item" : "Sign in to sell"}</Link>
          </nav>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> Built for projects, repairs and the people who keep them moving</span>
            <h1>Buy and sell what keeps you moving.</h1>
            <p>Find parts, tools, vehicles, workwear and gear from people and businesses near you.</p>
            <form className="search-box" onSubmit={submitSearch}>
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search parts, tools, boats, gear..." aria-label="Search listings" />
              <button type="submit">Search</button>
            </form>
            <div className="hero-actions">
              <a className="button" href="#listings">Browse listings <ArrowRight size={18} /></a>
              <Link className="button button-ghost" href={user ? "/sell" : "/login?next=/sell"}>Post an item</Link>
            </div>
            <div className="trust-row"><span><ShieldCheck /> Safety-first guidance</span><span><BadgeCheck /> Real seller profiles</span><span><Store /> Local and business sellers</span></div>
          </div>
          <div className="hero-panel" aria-label="Marketplace highlights">
            <div className="hero-panel-image"><Image src="https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&w=1400&q=85" alt="Mechanic working in a well-equipped garage" fill priority sizes="(max-width: 900px) 100vw, 42vw" /></div>
            <div className="floating-card floating-top"><Wrench /><span><strong>Repair help</strong>Guides and manuals</span></div>
            <div className="floating-card floating-bottom"><BadgeCheck /><span><strong>Buy smarter</strong>Know what to check</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="categories"><div className="shell">
        <div className="section-heading"><div><span className="kicker">Start exploring</span><h2>Browse by category</h2></div><a href="#listings">View all listings <ArrowRight size={17} /></a></div>
        <div className="category-grid">{categories.map((category) => <button className="category-card" key={category.name} onClick={() => chooseCategory(category.name)}><span className="category-icon">{category.icon}</span><span><strong>{category.name}</strong><small>{category.description}</small></span><ChevronRight size={20} /></button>)}</div>
      </div></section>

      <section className="section listings-section" id="listings"><div className="shell">
        <div className="section-heading listings-heading"><div><span className="kicker">Fresh finds</span><h2>{activeCategory === "All" ? "Latest listings" : activeCategory}</h2></div><div className="filter-row"><button className={activeCategory === "All" ? "filter active" : "filter"} onClick={() => setActiveCategory("All")}>All</button>{categories.slice(0, 5).map((category) => <button className={activeCategory === category.name ? "filter active" : "filter"} key={category.name} onClick={() => setActiveCategory(category.name)}>{category.name}</button>)}</div></div>
        {visibleListings.length ? <div className="listing-grid">{visibleListings.map((listing) => <article className="listing-card" key={listing.id}>
          <Link href={`/listing/${listing.id}`} className="listing-image"><Image src={listing.image_url} alt={listing.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /><span className="condition-badge">{listing.condition}</span>{listing.trade && <span className="trade-badge">Trade considered</span>}</Link>
          <button className={favorites.includes(listing.id) ? "favorite saved" : "favorite"} onClick={() => toggleFavorite(listing.id)} aria-label="Save listing"><Heart fill={favorites.includes(listing.id) ? "currentColor" : "none"} /></button>
          <div className="listing-info"><span className="listing-category">{listing.category}</span><Link href={`/listing/${listing.id}`}><h3>{listing.title}</h3></Link><strong className="price">{money.format(listing.price)}</strong><div className="listing-meta"><span><MapPin size={15} /> {listing.location}</span><span>{listing.seller_name}</span></div></div>
        </article>)}</div> : <div className="empty-state"><Search /><h3>No listings found</h3><p>Try another search or category.</p><button className="button" onClick={() => { setQuery(""); setActiveCategory("All"); }}>Clear filters</button></div>}
      </div></section>

      <section className="section how-section"><div className="shell"><div className="center-heading"><span className="kicker">Simple and direct</span><h2>How Anypart &amp; Gear works</h2><p>We connect buyers and sellers. You stay in control of payment, pickup and delivery.</p></div><div className="step-grid"><div className="step"><span>01</span><Search /><h3>Find what you need</h3><p>Search by item, category and location.</p></div><div className="step"><span>02</span><BadgeCheck /><h3>Check the details</h3><p>Review the listing and verify fitment.</p></div><div className="step"><span>03</span><Store /><h3>Contact the seller</h3><p>Agree on payment and exchange directly.</p></div></div></div></section>

      <section className="section business-section" id="business"><div className="shell business-card"><div><span className="eyebrow light"><Store size={15} /> Built for shops and independent sellers</span><h2>Turn extra inventory into opportunity.</h2><p>Post one item or upload up to 500 listings by CSV. Buyers contact you directly, and you control payment and delivery.</p><div className="check-list"><span>✓ Bulk inventory upload</span><span>✓ Business seller profile</span><span>✓ Direct buyer messages</span></div><Link className="button button-gold" href={user ? "/sell" : "/login?next=/sell"}>Start selling <ArrowRight size={18} /></Link></div><div className="business-stat"><strong>500</strong><span>items per CSV upload</span><small>No listing commission at launch</small></div></div></section>

      <section className="safety-banner"><div className="shell safety-inner"><ShieldCheck /><div><h2>Trade with confidence</h2><p>Meet safely, inspect items, verify fitment and never send payment before you are comfortable.</p></div><Link href="/safety">Read safety tips <ArrowRight size={17} /></Link></div></section>

      <footer><div className="shell footer-grid"><div><Link href="/" className="brand brand-footer"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><p>Buy smart. Sell easy. Keep projects moving.</p></div><div><strong>Marketplace</strong><a href="#categories">Categories</a><a href="#listings">Latest listings</a><Link href="/sell">Sell an item</Link></div><div><strong>Resources</strong><Link href="/safety">Safety tips</Link><a href="#business">For businesses</a><a href="mailto:support@anypartandgear.com">Contact</a></div><div><strong>Important</strong><p>Anypart &amp; Gear does not process payments, arrange shipping, guarantee fitment or handle returns. Verify the item and seller before paying.</p></div></div><div className="shell copyright">© {new Date().getFullYear()} Anypart &amp; Gear LLC. All rights reserved.</div></footer>
    </main>
  );
}
