"use client";
import { useEffect } from "react";
export default function ListingViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const record = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", record);
      void fetch("/api/listing-views", { method: "POST", credentials: "same-origin", keepalive: true,
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId }) }).catch(() => {});
    };
    record();
    if (document.visibilityState !== "visible") document.addEventListener("visibilitychange", record);
    return () => document.removeEventListener("visibilitychange", record);
  }, [listingId]);
  return null;
}
