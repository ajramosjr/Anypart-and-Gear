import "server-only";
import { createClient } from "@/lib/supabase/server";
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


function displayDate(value: string | null) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value || Date.now()));
}

function mapArticle(row: DatabaseTechArticle): TechArticle {
  return { slug: row.slug, imageUrl: row.image_url || undefined, category: row.category, title: row.title, summary: row.summary, readTime: row.read_time, published: displayDate(row.published_at), sections: row.sections, sources: row.sources };
}

export { getTechArticleImage } from "./article-images";

export async function getPublishedTechArticles(): Promise<TechArticle[]> {
  const { data, error } = await (await createClient()).from("tech_articles").select("id,slug,image_url,category,title,summary,read_time,sections,sources,status,published_at,created_at,updated_at").eq("status", "published").order("published_at", { ascending: false });
  if (error) return techArticles;
  const databaseArticles = (data as DatabaseTechArticle[]).map(mapArticle);
  const databaseSlugs = new Set(databaseArticles.map((article) => article.slug));
  return [...databaseArticles, ...techArticles.filter((article) => !databaseSlugs.has(article.slug))];
}

export async function getPublishedTechArticle(slug: string): Promise<TechArticle | undefined> {
  const { data, error } = await (await createClient()).from("tech_articles").select("id,slug,image_url,category,title,summary,read_time,sections,sources,status,published_at,created_at,updated_at").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) return techArticles.find((article) => article.slug === slug);
  return data ? mapArticle(data as DatabaseTechArticle) : techArticles.find((article) => article.slug === slug);
}
