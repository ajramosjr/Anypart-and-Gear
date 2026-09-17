import type { MetadataRoute } from "next";
import { techArticles } from "./tech-wire/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = "https://www.any-partandgear.com";
  const updated = new Date("2026-09-17T00:00:00Z");
  const staticRoutes = ["", "/tech-wire", "/shops", "/safety", "/support", "/terms", "/privacy", "/community-guidelines"];
  return [
    ...staticRoutes.map((path) => ({ url: `${origin}${path}`, lastModified: updated, changeFrequency: path === "" || path === "/tech-wire" ? "daily" as const : "monthly" as const, priority: path === "" ? 1 : path === "/tech-wire" ? .9 : .6 })),
    ...techArticles.map((article) => ({ url: `${origin}/tech-wire/${article.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
