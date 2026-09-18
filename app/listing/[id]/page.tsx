import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { Listing, sampleListings } from "@/lib/data";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import ContactSeller from "./contact-seller";
import ReportListing from "./report-listing";
import ListingGallery from "./listing-gallery";

async function findListing(id: string): Promise<Listing | null> {
  const sample = sampleListings.find((item) => item.id === id); if (sample) return sample;
  if (!hasSupabaseConfig()) return null;
  const supabase = await createClient(); const { data } = await supabase.from("listings").select("id,user_id,title,description,price,condition,category,location,seller_name,image_url,image_urls,trade,created_at").eq("id", id).eq("status", "active").single();
  return data as Listing | null;
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const [listing, user] = await Promise.all([findListing(id), getUser()]); if (!listing) notFound();
  const reportable = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(listing.id));
  let reputation: { average: number; count: number } | null = null;
  if (listing.user_id && hasSupabaseConfig()) {
    const supabase = await createClient();
    const { data: ratings } = await supabase.from("reviews").select("rating").eq("reviewee_id", listing.user_id);
    if (ratings?.length) reputation = { count: ratings.length, average: ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length };
  }
  return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href="/#listings">Back to listings</Link></div></header><div className="shell page-shell"><div className="detail-grid"><ListingGallery title={listing.title} primaryImage={listing.image_url} images={listing.image_urls} /><div className="detail-info"><span className="kicker">{listing.category}</span><h1>{listing.title}</h1><strong className="detail-price">${listing.price.toLocaleString()}</strong><div className="detail-facts"><span><b>Condition</b>{listing.condition}</span><span><b>Location</b><i><MapPin size={14} /> {listing.location}</i></span><span><b>Seller</b>{listing.seller_name}</span><span><b>Seller rating</b>{reputation ? <i className="seller-rating"><Star size={14}/> {reputation.average.toFixed(1)} ({reputation.count} verified)</i> : <i>New seller</i>}</span><span><b>Trade</b>{listing.trade ? "Considered" : "Not listed"}</span></div><h3>About this item</h3><p className="detail-description">{listing.description}</p><ContactSeller listingId={listing.id} sellerId={listing.user_id} currentUserId={user?.id} /><p className="detail-warning"><ShieldCheck size={16} /> Anypart &amp; Gear does not process payments or guarantee fitment. Inspect the item, verify the seller and use a safe meeting place before paying.</p><ReportListing listingId={String(listing.id)} currentUserId={user?.id} isOwner={Boolean(user?.id && listing.user_id === user.id)} reportable={reportable}/></div></div></div></main>;
}
