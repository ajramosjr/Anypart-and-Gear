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
const categories = ["All", "Auto", "Marine", "Motorcycle", "Tools", "Equipment", "Other"];

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
  const shown = posts.filter((post) => {
    const shop = shopById.get(post.shop_id);
    return shop && (selected === "All" || post.category === selected)
      && (!term || `${post.caption} ${shop.name} ${shop.specialty}`.toLowerCase().includes(term))
      && (!town || `${shop.location} ${shop.postal_code}`.toLowerCase().includes(town));
  });

  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/marketplace">Marketplace</Link><Link aria-current="page" href="/shops">Shops &amp; Sellers</Link><Link href="/messages">Messages</Link></nav></div></header>
    <section className="bg-white"><div className="shell py-10 sm:py-14"><span className="kicker">Local shops and sellers</span><h1 className="mt-2 text-4xl font-black sm:text-5xl">Shops &amp; Sellers</h1><p className="mt-2 text-slate-600">Explore parts stores, repair shops, salvage yards, and independent sellers.</p>
      <form action="/shops" className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]"><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><Search className="size-5 text-slate-500"/><input className="h-12 w-full outline-none" name="q" defaultValue={q} placeholder="Search shops, sellers, parts or services" aria-label="Search shop and seller posts" /></label><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><MapPin className="size-5 text-slate-500"/><input className="h-12 w-full outline-none sm:w-36" name="location" defaultValue={location} placeholder="Town or ZIP" aria-label="Town or ZIP" /></label><button className="button">Search</button></form>
      <nav aria-label="Shop and seller categories" className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <Link key={item} href={`/shops?${new URLSearchParams({ ...(q && { q }), ...(location && { location }), category: item })}`} aria-current={selected === item ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${selected === item ? "border-amber-500 bg-amber-400 text-[#071a35]" : "border-slate-300 bg-white text-slate-700"}`}>{item}</Link>)}</nav>
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
      <section className="mt-12 border-t border-slate-200 pt-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><span className="kicker">Shops &amp; Sellers directory</span><h2 className="page-title">Find a shop or seller</h2><p className="text-slate-600">Businesses can be found here even if they have not posted a photo.</p></div><Link className="button" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link></div>
        {shops.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shops.map((shop) => <Link key={shop.id} href={`/shops/${shop.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400"><strong className="text-lg">{shop.name}</strong><p className="text-sm text-slate-600">{shop.specialty} · {shop.location}</p></Link>)}</div> : <p className="rounded-xl bg-white p-6 text-slate-600">APG is growing its local business directory. No businesses have added a profile yet. Own a shop, parts store, marina, or industrial business? Join APG for free, showcase what you offer, and connect with new customers. <Link className="font-semibold text-[#071a35] underline" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link>.</p>}
      </section>
    </div>
    <section id="for-businesses" className="bg-[#0b2345] text-white"><div className="shell grid gap-8 py-12 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-black uppercase tracking-widest text-amber-400">For businesses</p><h2 className="mt-2 text-3xl font-black">Promote your business on APG.</h2><p className="mt-4 max-w-2xl text-slate-300">Create a free profile to show your specialty, services, hours and website. Buyers can contact your shop directly. Posting individual items or inventory is optional.</p><div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300"><span className="flex items-center gap-2"><Store className="size-4 text-amber-400"/> Business profile</span><span className="flex items-center gap-2"><Upload className="size-4 text-amber-400"/> Optional inventory</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-amber-400"/> Direct buyer contact</span></div></div><Link className="button whitespace-nowrap" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link></div></section>
  </main>;
}
