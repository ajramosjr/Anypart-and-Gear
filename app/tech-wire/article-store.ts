import { createClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";
import { techArticles, type TechArticle, type TechArticleSection } from "./articles";

export type DatabaseTechArticle = {
  id: string;
  slug: string;
  image_url: string | null;
  category: string;
  title: string;
  summary: string;
  read_time: string;
  sections: TechArticleSection[];
  sources: { label: string; url: string }[];
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function publicClient() {
  return createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function displayDate(value: string | null) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value || Date.now()));
}

function mapArticle(row: DatabaseTechArticle): TechArticle {
  return { slug: row.slug, imageUrl: row.image_url || undefined, category: row.category, title: row.title, summary: row.summary, readTime: row.read_time, published: displayDate(row.published_at), sections: row.sections, sources: row.sources };
}

const builtInArticleCovers: Record<string, string> = {
  "best-engine-upgrades-that-add-power-without-ruining-reliability": "/tech-wire/engine-upgrades-reliability-cover.webp",
  "milwaukee-m18-high-output-xc5-tool-watch": "/tech-wire/milwaukee-m18-high-output-xc5-tool-watch.webp",
  "milwaukee-packout-vaclink-vacuum-tool-watch": "/tech-wire/milwaukee-packout-vaclink-vacuum-tool-watch.webp",
  "bosch-expert-18v-2026-new-tools": "/tech-wire/bosch-expert-18v-2026-new-tools.webp",
  "bosch-two-in-one-impact-driver-wrench-pros-cons": "/tech-wire/bosch-two-in-one-impact-driver-wrench-pros-cons.webp",
  "2026-cordless-tool-platform-buying-guide": "/tech-wire/2026-cordless-tool-platform-buying-guide.webp",
  "electric-vehicle-pros-and-cons": "/tech-wire/electric-vehicle-pros-and-cons.webp",
  "plug-in-hybrid-pros-and-cons": "/tech-wire/plug-in-hybrid-pros-and-cons.webp",
  "driver-assistance-pros-and-cons": "/tech-wire/driver-assistance-pros-and-cons.webp",
  "software-defined-vehicle-pros-and-cons": "/tech-wire/software-defined-vehicle-pros-and-cons.webp",
  "next-generation-batteries-pros-and-cons": "/tech-wire/next-generation-batteries-pros-and-cons.webp",
  "hydrogen-vehicle-pros-and-cons": "/tech-wire/hydrogen-vehicle-pros-and-cons.webp",
  "best-engine-upgrades-before-more-power": "/tech-wire/best-engine-upgrades-before-more-power.webp",
  "towing-upgrades-that-actually-matter": "/tech-wire/towing-upgrades-that-actually-matter.webp",
  "engine-swap-planning-checklist": "/tech-wire/engine-swap-planning-checklist.webp",
  "cooling-system-upgrades-for-reliability": "/tech-wire/cooling-system-upgrades-for-reliability.webp",
  "turbo-vs-supercharger-street-build": "/tech-wire/turbo-vs-supercharger-street-build.webp",
  "used-engine-buying-checklist": "/tech-wire/used-engine-buying-checklist.webp",
};

export function getTechArticleImage(article: Pick<TechArticle, "slug" | "imageUrl">) {
  return article.imageUrl || builtInArticleCovers[article.slug] || `/tech-wire/${article.slug}/opengraph-image`;
}

export async function getPublishedTechArticles(): Promise<TechArticle[]> {
  const { data, error } = await publicClient().from("tech_articles").select("id,slug,image_url,category,title,summary,read_time,sections,sources,status,published_at,created_at,updated_at").eq("status", "published").order("published_at", { ascending: false });
  if (error) return techArticles;
  return (data as DatabaseTechArticle[]).map(mapArticle);
}

export async function getPublishedTechArticle(slug: string): Promise<TechArticle | undefined> {
  const { data, error } = await publicClient().from("tech_articles").select("id,slug,image_url,category,title,summary,read_time,sections,sources,status,published_at,created_at,updated_at").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) return techArticles.find((article) => article.slug === slug);
  return data ? mapArticle(data as DatabaseTechArticle) : undefined;
}
