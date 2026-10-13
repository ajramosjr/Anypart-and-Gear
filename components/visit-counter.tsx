"use client";
import { useEffect } from "react";
import { trackFunnel } from "@/lib/funnel";
export default function VisitCounter() {
  useEffect(() => {
    if (navigator.webdriver) return;
    trackFunnel("visit");
    function intent(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const url = new URL(link.getAttribute("href") || "", window.location.origin);
      if (url.origin !== window.location.origin) return;
      const next = url.pathname === "/login" ? url.searchParams.get("next") : url.pathname;
      if (next === "/sell") trackFunnel("sell_intent");
      if (url.pathname === "/login" && next?.startsWith("/listing/")) trackFunnel("contact_intent");
    }
    document.addEventListener("click", intent);
    return () => document.removeEventListener("click", intent);
  }, []);
  return null;
}
