import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck } from "lucide-react";
import { Listing, sampleListings } from "@/lib/data";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import ContactSeller from "./contact-seller";
import ReportListing from "./report-listing";

async function findListing(id: string): Promise<Listing | null> {
  const sample = sampleListings.find((item) => item.id === id); if (sample) return sample;
  if (!hasSupabaseConfig()) return null;
  const supabase = await createClient(); const { data } = await supabase.from("listings").select("id,user_id,title,description,price,condition,category,location,seller_name,image_url,image_urls,trade,created_at").eq("id", id).eq("status", "active").single();
  return data as Listing | null;
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const [listing, user] = await Promise.all([findListing(id), getUser()]); if (!listing) notFound();
  const reportable = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(listing.id));
  return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href="/#listings">Back to listings</Link></div></header><div className="shell page-shell"><div className="detail-grid"><div><div className="detail-image"><Image src={listing.image_url} alt={listing.title} fill priority sizes="(max-width: 700px) 100vw, 60vw" /></div>{listing.image_urls && listing.image_urls.length > 1 && <div className="thumbnail-row">{listing.image_urls.slice(1).map((src) => <div className="thumbnail" key={src}><Image src={src} alt="Additional listing view" fill sizes="120px" /></div>)}</div>}</div><div className="detail-info"><span className="kicker">{listing.category}</span><h1>{listing.title}</h1><strong className="detail-price">${listing.price.toLocaleString()}</strong><div className="detail-facts"><span><b>Condition</b>{listing.condition}</span><span><b>Location</b><i><MapPin size={14} /> {listing.location}</i></span><span><b>Seller</b>{listing.seller_name}</span><span><b>Trade</b>{listing.trade ? "Considered" : "Not listed"}</span></div><h3>About this item</h3><p className="detail-description">{listing.description}</p><ContactSeller listingId={listing.id} sellerId={listing.user_id} currentUserId={user?.id} /><p className="detail-warning"><ShieldCheck size={16} /> Anypart &amp; Gear does not process payments or guarantee fitment. Inspect the item, verify the seller and use a safe meeting place before paying.</p><ReportListing listingId={String(listing.id)} currentUserId={user?.id} isOwner={Boolean(user?.id && listing.user_id === user.id)} reportable={reportable}/></div></div></div></main>;
}
