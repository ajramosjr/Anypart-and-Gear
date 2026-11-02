"use client";
import Image, { type ImageProps } from "next/image";
// Seasonal campaigns stay off until a new one is explicitly enabled.
export function useOctoberAwareness() {
  return false;
}
export function SeasonalLogo(props: Omit<ImageProps, "src">) {
  return <Image {...props} alt={props.alt} src="/apg-logo.webp" />;
}
export function AwarenessBanner() {
  return null;
}
export function AskGearControl({ className }: { className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("apg-show-gear"))}>Ask APG</button>;
}
