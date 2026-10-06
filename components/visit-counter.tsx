"use client";
import { useEffect } from "react";
export default function VisitCounter() {
  useEffect(() => {
    if (navigator.webdriver) return;
    void fetch("/api/visits", { method: "POST", credentials: "same-origin", keepalive: true }).catch(() => {});
  }, []);
  return null;
}
