"use client";
import { usePathname } from "next/navigation";
import SiteHeader from "./site-header";
export default function AppNavigation({signedIn}:{signedIn:boolean}) {
  const path = usePathname();
  if (path === "/" || path === "/classic") return null;
  return <div className="apg-app-navigation"><SiteHeader signedIn={signedIn}/></div>;
}
