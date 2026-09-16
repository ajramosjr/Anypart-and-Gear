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
    .select("id,title,description,price,condition,category,location,seller_name,image_url,trade,created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(24);
  if (error || !data?.length) return sampleListings;
  return data as Listing[];
}

export default async function Home() {
  const [user, listings] = await Promise.all([getUser(), getListings()]);
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seller";
  return <Marketplace listings={listings} user={user?.email ? { name, email: user.email } : null} />;
}

