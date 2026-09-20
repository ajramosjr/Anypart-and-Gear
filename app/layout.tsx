import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./listing-overrides.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anypartandgear.com"),
  title: "Any Part & Gear | Parts, Gear and Vehicles",
  description: "Buy and sell parts for cars, boats, motorcycles, machinery, tools, workwear and more.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Any Part & Gear",
    title: "Any Part & Gear | Parts, Gear and Vehicles",
    description: "Buy and sell parts, gear, vehicles, boats, tools and machinery directly with local sellers.",
    images: [{ url: "/icons/apg-512.png", width: 512, height: 512, alt: "Any Part & Gear" }],
  },
  twitter: {
    card: "summary",
    title: "Any Part & Gear | Parts, Gear and Vehicles",
    description: "Buy and sell parts, gear, vehicles, boats, tools and machinery directly with local sellers.",
    images: ["/icons/apg-512.png"],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  robots: { index: true, follow: true },
  icons: {
    icon: "/icons/apg-192.png",
    shortcut: "/icons/apg-192.png",
    apple: "/icons/apg-180.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Any Part & Gear", statusBarStyle: "default" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <head>
        <meta name="theme-color" content="#0b2345" />
        <meta name="impact-site-verification" {...{ value: "bcd74494-e5d4-4dce-996c-b986ed203c39" }} />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
