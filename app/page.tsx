import Marketplace from "./marketplace";
import { getUser } from "@/lib/auth";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { Listing } from "@/lib/data";

export const dynamic = "force-dynamic";

type BusinessMarketplace = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  isVerified: boolean;
  itemCount: number;
};

async function getListings(): Promise<Listing[]> {
  if (!hasSupabaseConfig()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id,user_id,title,description,price,condition,category,location,seller_name,image_url,image_urls,trade,created_at")
    .eq("status", "active")
    .is("shop_id", null)
    .order("created_at", { ascending: false })
    .limit(24);
  if (error || !data?.length) return [];
  return data as Listing[];
}

async function getBusinessMarketplaces(): Promise<BusinessMarketplace[]> {
  if (!hasSupabaseConfig()) return [];
  const supabase = await createClient();
  const [{ data: shops, error: shopsError }, { data: inventory, error: inventoryError }] = await Promise.all([
    supabase.from("shops").select("id,name,specialty,location,is_verified").eq("is_active", true).order("name"),
    supabase.from("listings").select("shop_id").eq("status", "active").not("shop_id", "is", null),
  ]);
  if (shopsError || inventoryError || !shops?.length) return [];

  const counts = new Map<string, number>();
  inventory?.forEach((item) => {
    if (item.shop_id) counts.set(item.shop_id, (counts.get(item.shop_id) || 0) + 1);
  });

  return shops.map((shop) => ({
    id: shop.id,
    name: shop.name,
    specialty: shop.specialty,
    location: shop.location,
    isVerified: shop.is_verified,
    itemCount: counts.get(shop.id) || 0,
  }));
}

export default async function Home() {
  const [user, sourceListings, businesses] = await Promise.all([getUser(), getListings(), getBusinessMarketplaces()]);
  const sellerIds = [...new Set(sourceListings.map((item) => item.user_id).filter((id): id is string => Boolean(id)))];
  const profileBadges = new Map<string, { emailVerified: boolean; trustedSeller: boolean }>();
  const verifiedBusinesses = new Set<string>();
  if (sellerIds.length && hasSupabaseConfig()) {
    const supabase = await createClient();
    const [{ data: profiles }, { data: shops }] = await Promise.all([
      supabase.from("profiles").select("id,email_verified,trusted_seller").in("id", sellerIds),
      supabase.from("shops").select("owner_id").in("owner_id", sellerIds).eq("is_verified", true).eq("is_active", true),
    ]);
    profiles?.forEach((profile) => profileBadges.set(profile.id, { emailVerified: profile.email_verified, trustedSeller: profile.trusted_seller }));
    shops?.forEach((shop) => verifiedBusinesses.add(shop.owner_id));
  }
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seller";
  const signedIn = user?.email ? { id: user.id, name, email: user.email } : null;
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
    emailVerified: item.user_id ? profileBadges.get(item.user_id)?.emailVerified : false,
    trustedSeller: item.user_id ? profileBadges.get(item.user_id)?.trustedSeller : false,
    verifiedBusiness: item.user_id ? verifiedBusinesses.has(item.user_id) : false,
  }));
  return <Marketplace user={signedIn} signInPath="/login" signOutPath="/auth/signout" listings={listings} businesses={businesses} />;
}
