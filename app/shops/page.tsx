import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, ShieldCheck, Star, Store, Upload } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";
import ContactShop from "./contact-shop";
import { directoryBusinesses } from "./directory-businesses";
import ReportDirectory from "./report-directory";

export const dynamic = "force-dynamic";
type Shop = { id: string; owner_id: string; name: string; specialty: string; location: string; postal_code: string; is_verified: boolean };
type Post = { id: string; shop_id: string; category: string; caption: string; image_url: string; price: number | null };
const categories = ["All", "Auto", "Marine", "Motorcycle", "Tools", "Equipment", "RC & Hobby", "Other"];

const directoryAreas = ["Nassau", "Suffolk", "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];
const directoryGroups = ["Mechanic Shops", "Tire Shops", "All Parts Suppliers", "Parts Suppliers", "Auto Parts Suppliers", "Truck & Diesel Parts Suppliers", "Marine Parts Suppliers", "Equipment Parts Suppliers", "RC & Hobby Parts Suppliers", "Machine & Fabrication Shops", "A/C & Cooling Shops", "Hydraulic & Hose Shops", "Transmission Shops", "Marine Shops", "Motorcycle Shops", "Motorcycle Parts Suppliers", "Collision & Body Shops", "Hobby Shops", "Junkyards, Salvage & Recycling"];


export default async function ShopsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; location?: string; county?: string; type?: string }> }) {
  const [{ q = "", category = "All", location = "", county = "All", type = "All" }, user] = await Promise.all([searchParams, getUser()]);
  const supabase = await createClient();
  const [{ data: shopData }, { data: postData }] = await Promise.all([
    supabase.from("shops").select("id,owner_id,name,specialty,location,postal_code,is_verified").eq("is_active", true),
    supabase.from("business_posts").select("id,shop_id,category,caption,image_url,price").order("created_at", { ascending: false }).limit(120),
  ]);
  const shops = (shopData || []) as Shop[];
  const posts = (postData || []) as Post[];
  const shopById = new Map(shops.map((shop) => [shop.id, shop]));
  const { data: reviewData } = shops.length
    ? await supabase.from("reviews").select("reviewee_id,rating").in("reviewee_id", shops.map((shop) => shop.owner_id))
    : { data: [] };
  const ratings = new Map<string, { count: number; sum: number }>();
  for (const review of reviewData || []) {
    const current = ratings.get(review.reviewee_id) || { count: 0, sum: 0 };
    ratings.set(review.reviewee_id, { count: current.count + 1, sum: current.sum + review.rating });
  }
  const term = q.trim().toLowerCase();
  const town = location.trim().toLowerCase();
  const selected = categories.includes(category) ? category : "All";
  const selectedCounty = directoryAreas.includes(county) ? county : "All";
  const requestedType = type === "Salvage & Recycling" ? "Junkyards, Salvage & Recycling" : type;
  const selectedType = directoryGroups.includes(requestedType) ? requestedType : "All";
  const localResults = directoryBusinesses.filter((business) =>
    (selected === "All" || selected === business.category)
    && (selectedCounty === "All" || business.county === selectedCounty)
    && (selectedType === "All" || business.directoryTypes.includes(selectedType))
    && (!term || `${business.name} ${business.detail} ${business.directoryTypes.join(" ")} ${business.address}`.toLowerCase().includes(term))
    && (!town || business.town.toLowerCase().includes(town) || business.county.toLowerCase() === town || (business.county === "Manhattan" && town === "manhattan") || business.postal_code === town)
  ).sort((a, b) => a.town.localeCompare(b.town) || a.name.localeCompare(b.name));
  const towns = [...new Set(localResults.map((business) => business.town))];
  const locationChoices = [...new Set(directoryBusinesses.map((business) => `${business.town} (${business.postal_code})`))].sort();
  const filteredShops = shops.filter((shop) => (!term || `${shop.name} ${shop.specialty}`.toLowerCase().includes(term)) && (!town || `${shop.location} ${shop.postal_code}`.toLowerCase().includes(town)) && (selected === "All" || shop.specialty.toLowerCase().includes(selected.toLowerCase())));
  const queryLink = (overrides: Record<string, string>) => `/shops?${new URLSearchParams({ q, location, category: selected, county: selectedCounty, type: selectedType, ...overrides })}#long-island-directory`;
  const shown = posts.filter((post) => {
    const shop = shopById.get(post.shop_id);
    return shop && (selected === "All" || post.category === selected)
      && (!term || `${post.caption} ${shop.name} ${shop.specialty}`.toLowerCase().includes(term))
      && (!town || `${shop.location} ${shop.postal_code}`.toLowerCase().includes(town));
  });

  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/marketplace">Marketplace</Link><Link aria-current="page" href="/shops">Parts &amp; Repair Directory</Link><Link href="/messages">Messages</Link></nav></div></header>
    <section className="bg-white"><div className="shell py-10 sm:py-14"><span className="kicker">Long Island & NYC parts and repair services</span><h1 className="mt-2 text-4xl font-black sm:text-5xl">Parts &amp; Repair Directory</h1><p className="mt-2 text-slate-600">Find parts suppliers, mechanic shops, machine shops, transmission specialists, hose &amp; hydraulic shops, salvage yards, and more.</p>
      <nav aria-label="Parts categories" className="mt-5 flex flex-wrap gap-2">{[{ label: "All Parts", type: "All Parts Suppliers" }, { label: "Auto Parts", type: "Auto Parts Suppliers" }, { label: "Truck & Diesel Parts", type: "Truck & Diesel Parts Suppliers" }, { label: "Marine Parts", type: "Marine Parts Suppliers" }, { label: "Motorcycle Parts", type: "Motorcycle Parts Suppliers" }, { label: "Equipment Parts", type: "Equipment Parts Suppliers" }, { label: "RC & Hobby Parts", type: "RC & Hobby Parts Suppliers" }, { label: "Junkyards & Salvage", type: "Junkyards, Salvage & Recycling" }].map((item) => <Link key={item.type} href={queryLink({ type: item.type, category: "All" })} aria-current={selectedType === item.type ? "page" : undefined} style={{ color: "#071a35" }} className={`rounded-full border px-4 py-2 text-sm font-bold ${selectedType === item.type ? "border-amber-500 bg-amber-400" : "border-slate-300 bg-white hover:border-amber-500"}`}>{item.label}</Link>)}</nav>
      <form action="/shops#long-island-directory" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"><input type="hidden" name="category" value={selected}/><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><Search className="size-5 text-slate-500"/><input className="h-12 w-full outline-none" name="q" defaultValue={q} placeholder="Search suppliers, shops, parts or services" aria-label="Search businesses, parts and services" /></label><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><MapPin className="size-5 text-slate-500"/><input className="h-12 w-full outline-none sm:w-36" name="location" defaultValue={location} placeholder="Town, borough or ZIP" aria-label="Town, neighborhood, borough or ZIP" list="directory-locations" /></label><datalist id="directory-locations">{locationChoices.map((value) => <option key={value} value={value.replace(/ \(.*$/, "")}>{value}</option>)}</datalist><select name="county" defaultValue={selectedCounty} aria-label="County or borough" className="h-12 rounded-xl border border-slate-300 bg-white px-3"><option value="All">All counties &amp; boroughs</option>{directoryAreas.map((area) => <option key={area}>{area}</option>)}</select><select name="type" defaultValue={selectedType} aria-label="Business type" className="h-12 rounded-xl border border-slate-300 bg-white px-3"><option value="All">All shop types</option>{directoryGroups.map((group) => <option key={group}>{group}</option>)}</select><button className="button">Search</button></form>
      <nav aria-label="Parts and repair categories" className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <Link key={item} href={queryLink({ category: item })} aria-current={selected === item ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${selected === item ? "border-amber-500 bg-amber-400 text-[#071a35]" : "border-slate-300 bg-white text-slate-700"}`}>{item}</Link>)}</nav>
    </div></section>
    <div className="shell py-9">      <section id="long-island-directory" className="mt-10 scroll-mt-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-black">Long Island &amp; NYC Parts &amp; Repair Businesses</h2>
        <p className="mt-2 text-slate-600">Browse Nassau, Suffolk and all five NYC boroughs by town, neighborhood or ZIP, area and shop type. Independent listings are publicly listed and do not imply an APG partnership. Contact each business for current services and stock.</p>
        <p className="mt-2 text-sm text-slate-600">Coverage is growing; this is not a complete list of every Long Island or NYC business.</p>
        <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><strong>About these links:</strong> Business details checked refers to the listed business and its public contact information. Website links open an external site in a new tab. APG does not control those sites or guarantee website security, products or services.</p><div className="mt-5 flex flex-wrap items-center gap-3"><strong>{localResults.length} {localResults.length === 1 ? "business" : "businesses"} · {towns.length} {towns.length === 1 ? "town" : "towns"}</strong>{(q || location || selected !== "All" || selectedCounty !== "All" || selectedType !== "All") && <Link href="/shops#long-island-directory" className="text-sm font-bold underline">Clear filters</Link>}</div>
        <nav aria-label="Browse directory by town" className="mt-4 flex flex-wrap gap-2">{towns.map((name) => <a key={name} href={`#town-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold">{name}</a>)}</nav>
        {towns.length ? towns.map((name) => {
          const businesses = localResults.filter((business) => business.town === name);
          return <section key={name} id={`town-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="mt-8 scroll-mt-6"><h3 className="text-xl font-black">{name} <span className="text-sm font-semibold text-slate-500">{businesses[0].county} {["Nassau", "Suffolk"].includes(businesses[0].county) ? "County" : "borough"} · {[...new Set(businesses.map((business) => business.postal_code))].join(", ")}</span></h3>
          {(selectedType === "All" ? directoryGroups : [selectedType]).map((group) => { const grouped = businesses.filter((business) => selectedType === "All" ? business.directoryGroup === group : business.directoryTypes.includes(group)); return grouped.length ? <div key={group} className="mt-5"><h4 className="font-black text-slate-700">{group}</h4><div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{grouped.map((business) => <article key={`${business.name}-${business.address}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Independent listing · {business.category}</span><h5 className="mt-2 text-lg font-black">{business.name}</h5><p className="mt-2 text-sm text-slate-600">{business.detail}</p><p className="mt-3 text-sm text-slate-600">{business.address}</p><p className="mt-3 text-xs text-slate-500">Business details checked {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${business.checkedOn}T00:00:00Z`))}</p>{business.phone && <a href={`tel:${business.phone.replace(/[^0-9+]/g, "")}`} className="mt-2 inline-block text-sm font-bold underline">{business.phone}</a>}<p className="mt-2 break-all text-xs text-slate-600">{new URL(business.website).hostname.replace(/^www\./, "")}</p><div className="mt-4 flex flex-wrap gap-3"><a href={business.website} target="_blank" rel="noopener noreferrer" className="button button-small">Visit business website ↗</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold underline">Directions</a></div><div className="mt-4">{shops.some((shop) => shop.is_verified && shop.name === business.name && shop.location === business.address && shop.postal_code === business.postal_code) ? <Link className="button button-small" href={`/shops/${shops.find((shop) => shop.is_verified && shop.name === business.name && shop.location === business.address && shop.postal_code === business.postal_code)!.id}`}>APG Messages enabled</Link> : <Link className="button button-small" href={`/shops/register?directory=${encodeURIComponent(`${business.name}|${business.postal_code}`)}`}>Activate APG Messages</Link>}<p className="mt-2 text-xs text-slate-500">Represent this business? Request administrator approval to receive parts requests and reply through APG.</p></div><ReportDirectory name={business.name} address={business.address} website={business.website} currentUserId={user?.id} /></article>)}</div></div> : null; })}</section>;
        }) : <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-black">No directory businesses match these filters yet</h3><p className="mt-2 text-slate-600">Try another town, ZIP or shop type. Coverage is growing.</p><Link href="/shops#long-island-directory" className="mt-3 inline-block font-bold underline">Browse all directory businesses</Link></div>}
        <p className="mt-6 text-sm text-slate-600">Business owner? <Link href="/support" className="font-bold underline">Request a correction or removal</Link>, or <Link href="/shops/register" className="font-bold underline">create your APG business profile</Link>.</p>
      </section>
<div className="mb-5 mt-12 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-slate-600">{shown.length} {shown.length === 1 ? "post" : "posts"} from local businesses</p><Link className="button button-small" href={user ? "/shops/post" : "/login?next=/shops/post"}>Post for your business</Link></div>
      {shown.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shown.map((post) => {
        const shop = shopById.get(post.shop_id)!;
        const rating = ratings.get(shop.owner_id);
        return <article key={post.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#071a35] text-amber-400"><Store className="size-5"/></span><div className="min-w-0"><Link className="font-black hover:underline" href={`/shops/${shop.id}`}>{shop.name}</Link><p className="truncate text-xs text-slate-500">{shop.location}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">{rating ? <><Star className="size-3.5 fill-amber-400 text-amber-500"/><strong>{(rating.sum / rating.count).toFixed(1)}</strong> ({rating.count} {rating.count === 1 ? "review" : "reviews"})</> : "New — no reviews yet"}</p></div></div>
          <div className="relative aspect-[4/3] bg-slate-100"><Image src={post.image_url} alt={`Post by ${shop.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover"/></div>
          <div className="p-4"><span className="text-xs font-bold uppercase tracking-wide text-amber-700">{post.category}</span><p className="mt-1 line-clamp-3 min-h-12 font-semibold">{post.caption}</p>{post.price !== null && <p className="mt-2 font-black">${Number(post.price).toLocaleString()}</p>}<div className="mt-4"><ContactShop shopId={shop.id} ownerId={shop.owner_id} currentUserId={user?.id} nextPath="/shops" prompt={`I'm asking about your APG post: ${post.caption.slice(0, 120)}`} label="Ask shop"/></div><Link className="mt-3 inline-block text-sm font-bold underline" href={`/shops/${shop.id}`}>View APG Shop</Link></div>
        </article>;
      })}</div> : <div className="empty-state"><Store className="mx-auto mb-3"/><h2>No business posts yet</h2><p>{q || location || selected !== "All" ? "No posts match this search yet. Try another area or category; APG is still growing." : "APG is a new marketplace. Businesses can add their profiles and posts here as they join."}</p><Link className="button mt-5" href={user ? "/shops/post" : "/login?next=/shops/post"}>Share a business post</Link></div>}
      <section className="mt-12 border-t border-slate-200 pt-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><span className="kicker">Parts &amp; Repair Directory</span><h2 className="page-title">Find parts &amp; repair services</h2><p className="text-slate-600">Businesses can be found here even if they have not posted a photo.</p></div><Link className="button" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link></div>
        {filteredShops.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredShops.map((shop) => <Link key={shop.id} href={`/shops/${shop.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400"><strong className="text-lg">{shop.name}</strong><p className="text-sm text-slate-600">{shop.specialty} · {shop.location}</p></Link>)}</div> : <p className="rounded-xl bg-white p-6 text-slate-600">No registered business profiles match this search yet. Browse the independent listings above or try another town or category. Own a shop, parts store, marina, or industrial business? Join APG for free, showcase what you offer, and connect with new customers. <Link className="font-semibold text-[#071a35] underline" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link>.</p>}
      </section>


    </div>
    <section id="for-businesses" className="bg-[#0b2345] text-white"><div className="shell grid gap-8 py-12 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-black uppercase tracking-widest text-amber-400">For businesses</p><h2 className="mt-2 text-3xl font-black">Promote your business on APG.</h2><p className="mt-4 max-w-2xl text-slate-300">Create a free profile to show your specialty, services, hours and website. Buyers can contact your shop directly. Posting individual items or inventory is optional.</p><div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300"><span className="flex items-center gap-2"><Store className="size-4 text-amber-400"/> Business profile</span><span className="flex items-center gap-2"><Upload className="size-4 text-amber-400"/> Optional inventory</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-amber-400"/> Direct buyer contact</span></div></div><Link className="button whitespace-nowrap" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link></div></section>
  </main>;
}
