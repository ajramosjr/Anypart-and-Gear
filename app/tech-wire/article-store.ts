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
