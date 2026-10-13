import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = "https://www.anypartandgear.com";
  return ["", "/terms", "/privacy", "/affiliate-disclosure", "/community-guidelines"].map(path => ({
    url: `${origin}${path}`,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.3,
  }));
}
