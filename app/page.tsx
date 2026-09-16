import Marketplace from "./marketplace";
import { getUser } from "@/lib/auth";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { Listing, sampleListings } from "@/lib/data";

export const dynamic = "force-dynamic";

async function getListings(): Promise<Listing[]> {
  if (!hasSupabaseConfig()) return sampleListings;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id,title,description,price,condition,category,location,seller_name,image_url,image_urls,trade,created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(24);
  if (error || !data?.length) return sampleListings;
  return data as Listing[];
}

export default async function Home() {
  const [user, sourceListings] = await Promise.all([getUser(), getListings()]);
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seller";
  const signedIn = user?.email ? { name, email: user.email } : null;
  const listings = sourceListings.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    category: item.category,
    condition: item.condition,
    location: item.location,
    seller: item.seller_name,
    imageUrl: item.image_url,
    imageUrls: item.image_urls,
  }));
  return <Marketplace user={signedIn} signInPath="/login" signOutPath="/auth/signout" listings={listings} />;
}
