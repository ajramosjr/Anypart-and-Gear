import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, ShieldCheck, Star, Store, Upload } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";
import ContactShop from "./contact-shop";

export const dynamic = "force-dynamic";
type Shop = { id: string; owner_id: string; name: string; specialty: string; location: string; postal_code: string };
type Post = { id: string; shop_id: string; category: string; caption: string; image_url: string; price: number | null };
const categories = ["All", "Auto", "Marine", "Motorcycle", "Tools", "Equipment", "RC & Hobby", "Other"];

const localHobbyShops = [{"name":"Nassau Hobby Center","address":"13 W Merrick Road, Freeport, NY 11520","detail":"RC parts, power and control accessories, drones, helicopters, planes, cars, trucks and boats.","website":"https://nassauhobby.com/","phone":"516-378-9594"},{"name":"Willis Hobbies","address":"300 Willis Avenue, Mineola, NY 11501","detail":"RC and model hobby products, parts and accessories.","website":"https://willishobbies.com/","phone":"516-746-3944"}];

const directoryGroups = ["Mechanic Shops", "Parts Suppliers", "Marine Shops", "Collision & Body Shops"];
const seafordBusinesses = [
  {
    "name": "Joseph's Service & Collision",
    "address": "3458 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Auto diagnostics, maintenance, mechanical repairs and collision service.",
    "website": "https://www.josephsservice.com/",
    "phone": "516-679-8944",
    "directoryGroup": "Mechanic Shops"
  },
  {
    "name": "Sunrise Tire & Auto Repair — Seaford",
    "address": "4066 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Tires, wheel alignment, brakes, diagnostics and general auto maintenance.",
    "website": "https://www.sunrisetire.net/Find-Us/Mode/3/4066-Merrick-Rd-Seaford-NY-11783/details",
    "phone": "516-785-6015",
    "directoryGroup": "Mechanic Shops"
  },
  {
    "name": "Toyota of Massapequa — Parts & Service",
    "address": "3660 Sunrise Highway, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Toyota parts department and vehicle maintenance and repair services.",
    "website": "https://www.toyotaofmassapequany.com/parts-department",
    "phone": "516-981-4100",
    "directoryGroup": "Parts Suppliers"
  },
  {
    "name": "Final Touch Auto Collision — Seaford",
    "address": "3586 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Collision, body, frame and mechanical repair services.",
    "website": "https://www.finaltouchli.com/contact/",
    "phone": "516-221-7611",
    "directoryGroup": "Collision & Body Shops"
  },
  {
    "name": "Masters Auto Collision — Seaford",
    "address": "3530 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Auto body and collision repairs, painting and towing services.",
    "website": "https://www.masterscollision.com/services/",
    "phone": "516-826-2763",
    "directoryGroup": "Collision & Body Shops"
  },
  {
    "name": "Jiffy Lube — Seaford",
    "address": "3848 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Oil changes and vehicle preventive maintenance. Contact the location for available services.",
    "website": "https://www.jiffylube.com/locations/ny/seaford/815",
    "phone": "516-783-4324",
    "directoryGroup": "Mechanic Shops"
  },
  {
    "name": "Blue Marlin Boats",
    "address": "4076 Merrick Road, Seaford, NY 11783",
    "category": "Marine",
    "detail": "Boat parts and accessories, maintenance and repair services.",
    "website": "https://www.bluemarlinboats.net/we-offer-great-variety-of-boats-dealership--parts",
    "phone": "516-679-2121",
    "directoryGroup": "Marine Shops"
  },
  {
    "name": "Jetmore Jetski",
    "address": "3726 Ocean Avenue, Seaford, NY 11783",
    "category": "Marine",
    "detail": "Jet ski and jet boat repairs, mobile service, winterization and storage.",
    "website": "https://jetmorejetski.com/",
    "phone": "516-765-1861",
    "directoryGroup": "Marine Shops"
  },
  {
    "name": "Matt's Marina",
    "address": "2740 Peconic Avenue, Seaford, NY 11783",
    "category": "Marine",
    "detail": "Marina storage, dockage, maintenance, repairs and repowers.",
    "website": "https://mattsmarinali.com/",
    "phone": "516-324-6819",
    "directoryGroup": "Marine Shops"
  }
];

export default async function ShopsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; location?: string }> }) {
  const [{ q = "", category = "All", location = "" }, user] = await Promise.all([searchParams, getUser()]);
  const supabase = await createClient();
  const [{ data: shopData }, { data: postData }] = await Promise.all([
    supabase.from("shops").select("id,owner_id,name,specialty,location,postal_code").eq("is_active", true),
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
  const localResults = seafordBusinesses.filter((business) => (selected === "All" || selected === business.category) && (!term || `${business.name} ${business.detail}`.toLowerCase().includes(term)) && (!town || business.address.toLowerCase().includes(town)));
  const shown = posts.filter((post) => {
    const shop = shopById.get(post.shop_id);
    return shop && (selected === "All" || post.category === selected)
      && (!term || `${post.caption} ${shop.name} ${shop.specialty}`.toLowerCase().includes(term))
      && (!town || `${shop.location} ${shop.postal_code}`.toLowerCase().includes(town));
  });

  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/marketplace">Marketplace</Link><Link aria-current="page" href="/shops">Parts &amp; Repair Directory</Link><Link href="/messages">Messages</Link></nav></div></header>
    <section className="bg-white"><div className="shell py-10 sm:py-14"><span className="kicker">Local parts and repair services</span><h1 className="mt-2 text-4xl font-black sm:text-5xl">Parts &amp; Repair Directory</h1><p className="mt-2 text-slate-600">Find parts suppliers, mechanic shops, machine shops, transmission specialists, hose &amp; hydraulic shops, salvage yards, and more.</p>
      <form action="/shops" className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]"><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><Search className="size-5 text-slate-500"/><input className="h-12 w-full outline-none" name="q" defaultValue={q} placeholder="Search suppliers, shops, parts or services" aria-label="Search parts and repair posts" /></label><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><MapPin className="size-5 text-slate-500"/><input className="h-12 w-full outline-none sm:w-36" name="location" defaultValue={location} placeholder="Town or ZIP" aria-label="Town or ZIP" /></label><button className="button">Search</button></form>
      <nav aria-label="Parts and repair categories" className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <Link key={item} href={`/shops?${new URLSearchParams({ ...(q && { q }), ...(location && { location }), category: item })}`} aria-current={selected === item ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${selected === item ? "border-amber-500 bg-amber-400 text-[#071a35]" : "border-slate-300 bg-white text-slate-700"}`}>{item}</Link>)}</nav>
    </div></section>
    <div className="shell py-9"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-slate-600">{shown.length} {shown.length === 1 ? "post" : "posts"} from local businesses</p><Link className="button button-small" href={user ? "/shops/post" : "/login?next=/shops/post"}>Post for your business</Link></div>
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
        {shops.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shops.map((shop) => <Link key={shop.id} href={`/shops/${shop.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400"><strong className="text-lg">{shop.name}</strong><p className="text-sm text-slate-600">{shop.specialty} · {shop.location}</p></Link>)}</div> : <p className="rounded-xl bg-white p-6 text-slate-600">APG is growing its local business directory. No businesses have added a profile yet. Own a shop, parts store, marina, or industrial business? Join APG for free, showcase what you offer, and connect with new customers. <Link className="font-semibold text-[#071a35] underline" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link>.</p>}
      </section>

      {localResults.length > 0 && <section className="mt-10 border-t border-slate-200 pt-8"><h2 className="text-2xl font-black">Parts &amp; repair businesses in 11783</h2><p className="mt-2 text-slate-600">Browse by business type. These independent directory listings are unclaimed and do not imply an APG partnership. Contact each business for current services and stock.</p><nav aria-label="Business types" className="mt-5 flex flex-wrap gap-3">{directoryGroups.filter((group) => localResults.some((business) => business.directoryGroup === group)).map((group) => <a key={group} href={`#directory-${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold">{group}</a>)}{(selected === "All" || selected === "RC & Hobby") && (!town || localHobbyShops.some((shop) => shop.address.toLowerCase().includes(town))) && <a href="#nearby-hobby-shops" className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold">Hobby Shops</a>}</nav>{directoryGroups.map((group) => { const businesses = localResults.filter((business) => business.directoryGroup === group); return businesses.length > 0 ? <section key={group} id={`directory-${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="mt-8 scroll-mt-6"><h3 className="text-xl font-black">{group}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{businesses.map((business) => <article key={business.website} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Unclaimed listing · {business.category}</span><h4 className="mt-2 text-lg font-black">{business.name}</h4><p className="mt-2 text-sm text-slate-600">{business.detail}</p><p className="mt-3 text-sm text-slate-600">{business.address}</p><a href={`tel:${business.phone}`} className="mt-2 inline-block text-sm font-bold underline">{business.phone}</a><div className="mt-4"><a href={business.website} target="_blank" rel="noopener noreferrer" className="button button-small">Visit website</a></div></article>)}</div></section> : null; })}<p className="mt-4 text-sm text-slate-600">Business owner? <Link href="/support" className="font-bold underline">Request a correction or removal</Link>, or <Link href="/shops/register" className="font-bold underline">create your APG business profile</Link>.</p></section>}
      {(selected === "All" || selected === "RC & Hobby") && (!town || localHobbyShops.some((shop) => shop.address.toLowerCase().includes(town))) && <section id="nearby-hobby-shops" className="mt-10 scroll-mt-6 border-t border-slate-200 pt-8"><h2 className="text-2xl font-black">Hobby shops around Seaford (11783)</h2><p className="mt-2 text-slate-600">Nearby options in Freeport and Mineola. These independent directory listings are unclaimed; listing a business does not imply an APG partnership. Contact each shop for current stock.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{localHobbyShops.filter((shop) => (!term || `${shop.name} ${shop.detail}`.toLowerCase().includes(term)) && (!town || shop.address.toLowerCase().includes(town))).map((shop) => <article key={shop.website} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Unclaimed listing</span><h3 className="mt-2 text-lg font-black">{shop.name}</h3><p className="mt-2 text-sm text-slate-600">{shop.detail}</p><p className="mt-3 text-sm text-slate-600">{shop.address}</p><a href={`tel:${shop.phone}`} className="mt-2 inline-block text-sm font-bold underline">{shop.phone}</a><div className="mt-4"><a href={shop.website} target="_blank" rel="noopener noreferrer" className="button button-small">Visit website</a></div></article>)}</div><p className="mt-4 text-sm text-slate-600">Business owner? <Link href="/support" className="font-bold underline">Request a correction or removal</Link>, or <Link href="/shops/register" className="font-bold underline">create your APG business profile</Link>.</p></section>}

    </div>
    <section id="for-businesses" className="bg-[#0b2345] text-white"><div className="shell grid gap-8 py-12 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-black uppercase tracking-widest text-amber-400">For businesses</p><h2 className="mt-2 text-3xl font-black">Promote your business on APG.</h2><p className="mt-4 max-w-2xl text-slate-300">Create a free profile to show your specialty, services, hours and website. Buyers can contact your shop directly. Posting individual items or inventory is optional.</p><div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300"><span className="flex items-center gap-2"><Store className="size-4 text-amber-400"/> Business profile</span><span className="flex items-center gap-2"><Upload className="size-4 text-amber-400"/> Optional inventory</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-amber-400"/> Direct buyer contact</span></div></div><Link className="button whitespace-nowrap" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link></div></section>
  </main>;
}
