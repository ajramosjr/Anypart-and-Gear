import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GearsAssistant } from "@/components/gears-assistant";
import PasswordRecoveryRedirect from "@/components/password-recovery-redirect";
import VisitCounter from "@/components/visit-counter";
import { getTechWireState } from "@/lib/tech-wire";
import { TechWireNavigationProvider } from "@/components/tech-wire-navigation";
import { getBuildIdeasState } from "@/lib/build-ideas";
import { BuildIdeasNavigationProvider } from "@/components/build-ideas-navigation";
import { getUser } from "@/lib/auth";
import { AdminNavigationProvider } from "@/components/admin-navigation";
import "./globals.css";
import "./local-fonts.css";
import "./listing-overrides.css";
import "../public/apg-interactions.css";
import "./apg-design.css";


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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ enabled }, buildIdeas, user] = await Promise.all([getTechWireState(), getBuildIdeasState(), getUser()]);
  return (
    <html lang="en">
      <head>
        <meta name="fo-verify" content="0db0813a-76e8-499e-ace8-89554311b01e" />
        <meta name="theme-color" content="#0b2345" />
        <meta name="impact-site-verification" {...{ value: "bcd74494-e5d4-4dce-996c-b986ed203c39" }} />
      </head>
      <body>
        {/* Preserve AvantLink’s exact temporary ownership tag for its source checker. */}
        <div hidden dangerouslySetInnerHTML={{ __html: "<script type=\"text/javascript\" src=\"http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=4aae4f982e39047e18f41f9187bc54581ca2b007\"></script>" }} />
        <PasswordRecoveryRedirect />
        <AdminNavigationProvider isAdmin={user?.id === "5dd24cb6-6706-4c4e-8c17-0b03b2632acb" && user.app_metadata?.role === "admin"}><TechWireNavigationProvider enabled={enabled}><BuildIdeasNavigationProvider enabled={buildIdeas.enabled}>{children}</BuildIdeasNavigationProvider></TechWireNavigationProvider></AdminNavigationProvider>
        <GearsAssistant />
        <VisitCounter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
