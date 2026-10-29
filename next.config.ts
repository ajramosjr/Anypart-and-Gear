import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_APG_VERSION: process.env.VERCEL_GIT_COMMIT_SHA || "2026-10-29-unified-layout-1" },
  async headers() {
    return ["/sw.js", "/manifest.webmanifest"].map(source => ({source, headers:[{key:"Cache-Control",value:"no-cache, max-age=0, must-revalidate"}]}));
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};
export default nextConfig;
