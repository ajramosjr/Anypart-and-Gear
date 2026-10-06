"use client";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
export function useOctoberAwareness() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const update = () => setActive(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "numeric", year: "numeric" }).format(new Date()) === "10/2026");
    update(); const timer = window.setInterval(update, 60000); return () => window.clearInterval(timer);
  }, []);
  return active;
}
export function SeasonalLogo(props: Omit<ImageProps, "src">) {
  const active = useOctoberAwareness();
  return <Image {...props} alt={props.alt} src={active ? "/apg-october-logo.png" : "/apg-logo.webp"} />;
}
export function AwarenessBanner() {
  const active = useOctoberAwareness();
  return active ? <div className="apg-awareness-banner"><svg aria-hidden="true" viewBox="0 0 32 40" width="24" height="30" fill="#db2777"><path d="M16 1C5 1 5 10 8 16L25 39l6-6L14 10c-1-2 0-3 2-3s3 1 2 3L1 33l6 6 17-23C27 10 27 1 16 1Z" /></svg><span>APG supports Breast Cancer Awareness Month</span></div> : null;
}
export function AskGearControl({ className }: { className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("apg-show-gear"))}>Ask Gear</button>;
}
