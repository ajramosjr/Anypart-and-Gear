import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";
import { techArticles } from "./tech-wire/articles";
import { getPublishedTechArticles } from "./tech-wire/article-store";

type SearchListing = { id: string; created_at: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = "https://www.anypartandgear.com";
  const updated = new Date("2026-09-26T00:00:00Z");
  const staticRoutes = ["", "/toolbox", "/tech-wire", "/shops", "/safety", "/support", "/terms", "/privacy", "/affiliate-disclosure", "/community-guidelines", "/trust"];
  const publicClient = createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [publishedArticles, listingResult] = await Promise.all([
    getPublishedTechArticles(),
    publicClient.from("listings").select("id,created_at").eq("status", "active").order("created_at", { ascending: false }),
  ]);
  const listings = (listingResult.data || []) as SearchListing[];
  return [
    ...staticRoutes.map((path) => ({ url: `${origin}${path}`, lastModified: updated, changeFrequency: path === "" || path === "/tech-wire" ? "daily" as const : "monthly" as const, priority: path === "" ? 1 : path === "/tech-wire" || path === "/toolbox" ? .9 : .6 })),
    ...(publishedArticles.length ? publishedArticles : techArticles).map((article) => ({ url: `${origin}/tech-wire/${article.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: .7 })),
    ...listings.map((listing) => ({ url: `${origin}/listing/${listing.id}`, lastModified: new Date(listing.created_at), changeFrequency: "weekly" as const, priority: .8 })),
  ];
}
