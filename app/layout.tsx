import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.any-partandgear.com"),
  title: "Any Part & Gear | Find the part. Finish the job.",
  description: "Buy and sell parts for cars, boats, motorcycles, machinery, tools, workwear and more.",
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
      <head><meta name="theme-color" content="#0b2345" /></head>
      <body>{children}</body>
    </html>
  );
}
