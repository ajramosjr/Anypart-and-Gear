import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/listing/", "/shops", "/tech-wire/", "/safety", "/support"],
      disallow: ["/account", "/admin", "/api/", "/login", "/messages", "/reset-password", "/sell"],
    },
    sitemap: "https://www.anypartandgear.com/sitemap.xml",
    host: "https://www.anypartandgear.com",
  };
}
