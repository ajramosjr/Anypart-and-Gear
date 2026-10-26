import "@/app/home-feed.css";
import PartsList from "./parts-list";
import { getSubaruParts, getPartOutDescription } from "@/lib/part-out";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, PackageCheck, ShieldCheck, Star, Home, Package, Store, BookOpen, MessageCircle, UserRound } from "lucide-react";
import { Listing } from "@/lib/data";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import SellerBadges from "@/components/seller-badges";
import ContactSeller from "./contact-seller";
import ReportListing from "./report-listing";
import ListingGallery from "./listing-gallery";
import ApgLogo from "@/components/apg-logo";


async function findListing(id: string): Promise<(Listing & { allow_offers: boolean; shop_id: string | null }) | null> {
  if (!hasSupabaseConfig()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("listings").select("id,user_id,title,description,price,condition,category,location,seller_name,image_url,image_urls,video_url,trade,allow_offers,shop_id,created_at").eq("id", id).eq("status", "active").single();
  return data as (Listing & { allow_offers: boolean; shop_id: string | null }) | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await findListing(id);
  if (!listing) return { title: "Listing unavailable", robots: { index: false, follow: false } };
  const url = `/listing/${listing.id}`;
  const description = listing.description.length > 155 ? `${listing.description.slice(0, 152).trim()}...` : listing.description;
  return {
    title: `${listing.title} | Any Part & Gear`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: listing.title,
      description,
      siteName: "Any Part & Gear",
      images: [{ url: listing.image_url, alt: listing.title }],
    },
    twitter: { card: "summary_large_image", title: listing.title, description, images: [listing.image_url] },
  };
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, user] = await Promise.all([findListing(id), getUser()]);
  if (!listing) notFound();
  const parts = getSubaruParts(listing);
  const reportable = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(listing.id));
  let reputation: { average: number; count: number } | null = null;
  let badges = { emailVerified: false, trustedSeller: false, verifiedBusiness: false };
  let shop: { id: string; name: string } | null = null;
  let sellerStats: { memberSince: string | null; activeListings: number } = { memberSince: null, activeListings: 0 };

  if (listing.user_id && hasSupabaseConfig()) {
    const supabase = await createClient();
    const [{ data: ratings }, { data: profile }, { data: shopData }, { count: activeListingCount }] = await Promise.all([
      supabase.from("reviews").select("rating").eq("reviewee_id", listing.user_id),
      supabase.from("profiles").select("email_verified,trusted_seller,created_at").eq("id", listing.user_id).maybeSingle(),
      listing.shop_id ? supabase.from("shops").select("id,name,is_verified").eq("id", listing.shop_id).eq("owner_id", listing.user_id).eq("is_active", true).maybeSingle() : Promise.resolve({ data: null }),
      supabase.from("listings").select("id", { count: "exact", head: true }).eq("user_id", listing.user_id).eq("status", "active"),
    ]);
    if (ratings?.length) reputation = { count: ratings.length, average: ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length };
    shop = shopData ? { id: shopData.id, name: shopData.name } : null;
    badges = { emailVerified: Boolean(profile?.email_verified), trustedSeller: Boolean(profile?.trusted_seller), verifiedBusiness: Boolean(shopData?.is_verified) };
    sellerStats = { memberSince: profile?.created_at || null, activeListings: activeListingCount || 0 };
  }

  return (
    <main className="live-feed apg-modern-listing">
      <header className="lf-header"><div className="lf-header-inner"><ApgLogo priority/><div style={{flex:1}}/><Link className="lf-icon-button" aria-label="Messages" href={user?'/messages':'/login?next=/messages'}><MessageCircle size={23}/></Link><Link className="lf-account" aria-label="My account" href={user?'/account':'/login'}><UserRound size={20}/></Link></div></header>
      <div className="ml-shell"><Link href="/#parts" className="ml-back">← Back to Parts</Link><div className={parts ? "ml-grid ml-parts-grid" : "ml-grid"}>
        {!parts && <ListingGallery title={listing.title} primaryImage={listing.image_url} images={listing.image_urls} videoUrl={listing.video_url} />}
        <div className="detail-info">
          <span className="ml-category">{listing.category}</span><h1>{parts ? "Subaru Parts" : listing.title}</h1>{parts && <p>{listing.title}</p>}<strong className="detail-price">{parts ? "Prices listed by part" : `$${listing.price.toLocaleString()}`}</strong>
          <p className="ml-location"><MapPin size={16}/>{listing.location}</p>
          <span className="ml-condition">{listing.condition}</span>
          <h3>About this item</h3><p className="detail-description">{parts ? getPartOutDescription(listing.description) : listing.description}</p>
          <div className="ml-seller"><span className="lf-avatar">{listing.seller_name?.split(' ').map(word=>word[0]).slice(0,2).join('')||'APG'}</span><div><strong>{listing.seller_name}</strong><SellerBadges {...badges}/></div></div>
          <div className="mt-5"><ContactSeller listingId={listing.id} sellerId={listing.user_id} currentUserId={user?.id} allowOffers={listing.allow_offers} listingPrice={listing.price} offerItems={parts?.map(part => ({ name: part.name, price: part.price }))} /></div>
          <div className="detail-facts">
            <span><b>Condition</b>{listing.condition}</span><span><b>Location</b><i><MapPin size={14} /> {listing.location}</i></span>
            <span><b>Seller</b><i>{listing.seller_name}<SellerBadges {...badges} /></i></span>
            {shop && <span><b>Business</b><Link className="inline-link" href={`/shops/${shop.id}`}>{shop.name}</Link></span>}
            <span><b>Seller rating</b>{reputation ? <i className="seller-rating"><Star size={14}/> {reputation.average.toFixed(1)} ({reputation.count} verified)</i> : <i>New seller</i>}</span>
            {sellerStats.memberSince && <span><b>Member since</b><i><CalendarDays size={14}/> {new Date(sellerStats.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</i></span>}
            <span><b>Active listings</b><i><PackageCheck size={14}/> {sellerStats.activeListings}</i></span>
            <span><b>Trade</b>{listing.trade ? "Considered" : "Not listed"}</span>
          </div>
          <p className="detail-warning"><ShieldCheck size={16} /> Anypart &amp; Gear does not process payments or guarantee fitment. Inspect the item, verify the seller and use a safe meeting place before paying.</p>
          <ReportListing listingId={String(listing.id)} currentUserId={user?.id} isOwner={Boolean(user?.id && listing.user_id === user.id)} reportable={reportable}/>
        </div>
        {parts && <PartsList parts={parts} />}
      </div></div>
      <nav className="lf-bottom-nav" aria-label="Quick navigation"><Link href="/"><Home size={20}/>Home</Link><Link href="/#parts" className="lf-current" aria-current="page"><Package size={20}/>Parts</Link><Link href="/#directory"><Store size={20}/>Directory</Link><Link href="/#resources"><BookOpen size={20}/>Learn</Link><Link href={user?'/account':'/login'}><UserRound size={20}/>Account</Link></nav>
      <style>{`
.apg-modern-listing{padding-bottom:100px}
.apg-modern-listing .lf-header{display:block!important}
.apg-modern-listing .ml-shell{max-width:1120px;margin:auto;padding:24px}
.apg-modern-listing .ml-back{display:inline-flex;align-items:center;min-height:44px;margin-bottom:18px;font-weight:600}
.apg-modern-listing .ml-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:26px;align-items:start}
.apg-modern-listing .ml-parts-grid{grid-template-columns:minmax(0,360px) minmax(0,1fr)}
.apg-modern-listing .detail-image{min-height:0;aspect-ratio:1/1;border-radius:20px;background:#e9eef5}
.apg-modern-listing .detail-image img{object-fit:contain}
.apg-modern-listing .detail-info{padding:24px;background:white;border:1px solid #e1e7ef;border-radius:20px;box-shadow:0 5px 25px #10233c06}
.apg-modern-listing .detail-info h1{font-family:Arial,Helvetica,sans-serif!important;text-transform:none!important;font-size:28px!important;line-height:1.2;font-weight:800;letter-spacing:-.7px;margin:8px 0 14px}
.apg-modern-listing .detail-price{font-family:Arial,Helvetica,sans-serif!important;display:block;font-size:36px!important;line-height:1.2;font-weight:800;letter-spacing:-1px;color:#10233c}
.apg-modern-listing .ml-category{font-size:11px;font-weight:700;color:#8a681b;letter-spacing:.8px}
.apg-modern-listing .ml-location{display:flex;gap:6px;align-items:center;font-size:14px;margin:14px 0;color:#10233c}
.apg-modern-listing .ml-condition{display:inline-flex;background:#eaf2ed;border-radius:30px;padding:5px 12px;font-size:13px;color:#204e39}
.apg-modern-listing .detail-info h3{font:700 16px Arial,Helvetica,sans-serif;margin:24px 0 8px;text-transform:none;letter-spacing:0}
.apg-modern-listing .detail-description{font:400 15px/1.7 Arial,Helvetica,sans-serif;color:#10233c;white-space:pre-wrap}
.apg-modern-listing .ml-seller{display:flex;align-items:center;gap:12px;border-top:1px solid #e1e7ef;margin-top:22px;padding-top:20px}
.apg-modern-listing .ml-seller strong{display:block;margin-bottom:5px}
.apg-modern-listing .contact-actions{display:flex;gap:10px;flex-wrap:wrap}
.apg-modern-listing.apg-modern-listing .contact-actions .detail-button{flex:1;min-width:140px;min-height:46px;padding:12px!important;border-radius:10px!important;background:#e6b944!important;border:1px solid #d1a13e!important;color:#10233c!important;font:700 14px Arial,Helvetica,sans-serif!important;text-transform:none;letter-spacing:0;box-shadow:none!important}
.apg-modern-listing.apg-modern-listing .contact-actions .detail-button:nth-child(2){background:white!important;border-color:#10233c!important}
.apg-modern-listing .detail-facts{display:grid;grid-template-columns:1fr 1fr;gap:14px;border-top:1px solid #e1e7ef;margin-top:24px;padding-top:20px}
.apg-modern-listing .detail-facts span{font-size:13px;min-width:0}
.apg-modern-listing .detail-facts b{font-size:11px;letter-spacing:0;text-transform:none;color:#536277;margin-bottom:6px}
.apg-modern-listing .detail-facts i{font-size:13px;font-style:normal;display:flex;gap:5px;flex-wrap:wrap;align-items:center}
.apg-modern-listing .detail-warning{font:400 12px/1.6 Arial,Helvetica,sans-serif;background:#f5f7fa;border-radius:10px;padding:12px;margin-top:24px;color:#10233c}
.apg-modern-listing .lf-bottom-nav a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}
@media(max-width:800px){.apg-modern-listing .ml-shell{padding:18px 14px}.apg-modern-listing .ml-grid,.apg-modern-listing .ml-parts-grid{grid-template-columns:1fr;gap:16px}.apg-modern-listing .detail-info{padding:20px}.apg-modern-listing .detail-info h1{font-size:25px!important}.apg-modern-listing .lf-bottom-nav{display:flex!important}}
`}</style>
    </main>
  );
}
