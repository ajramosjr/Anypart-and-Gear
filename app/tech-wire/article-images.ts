import type { TechArticle } from "./articles";
const builtInArticleCovers: Record<string, string> = {
  "fuel-guide-gasoline-ethanol-diesel-marine-equipment": "/tech-wire/fuel-guide-gasoline-ethanol-diesel-marine-equipment.webp",
  "boaterhome-rv-boat-should-come-back": "/tech-wire/boaterhome-rv-boat-should-come-back.webp",
  "changing-fuels-hybrids-auto-marine-work": "/tech-wire/changing-fuels-hybrids-auto-marine-work.webp",
  "used-boat-recall-and-hin-checklist": "/tech-wire/used-boat-recall-and-hin-checklist.webp",
  "e15-fuel-warning-for-boats": "/tech-wire/e15-fuel-warning-for-boats.webp",
  "outboard-maintenance-parts-checklist": "/tech-wire/outboard-maintenance-parts-checklist.webp",
  "boat-engine-cutoff-switch-safety-check": "/tech-wire/boat-engine-cutoff-switch-safety-check.webp",
  "best-engine-upgrades-that-add-power-without-ruining-reliability": "/tech-wire/engine-upgrades-reliability-cover.webp",
  "milwaukee-m18-high-output-xc5-tool-watch": "/tech-wire/milwaukee-m18-high-output-xc5-tool-watch.webp",
  "milwaukee-packout-vaclink-vacuum-tool-watch": "/tech-wire/milwaukee-packout-vaclink-vacuum-tool-watch.webp",
  "bosch-expert-18v-2026-new-tools": "/tech-wire/bosch-expert-18v-2026-new-tools.webp",
  "bosch-two-in-one-impact-driver-wrench-pros-cons": "/tech-wire/bosch-two-in-one-impact-driver-wrench-pros-cons.webp",
  "2026-cordless-tool-platform-buying-guide": "/tech-wire/2026-cordless-tool-platform-buying-guide.webp",
  "electric-vehicle-pros-and-cons": "/tech-wire/electric-vehicle-pros-and-cons.webp",
  "plug-in-hybrid-pros-and-cons": "/tech-wire/plug-in-hybrid-pros-and-cons.webp",
  "driver-assistance-pros-and-cons": "/tech-wire/driver-assistance-pros-and-cons.webp",
  "software-defined-vehicle-pros-and-cons": "/tech-wire/software-defined-vehicle-pros-and-cons.webp",
  "next-generation-batteries-pros-and-cons": "/tech-wire/next-generation-batteries-pros-and-cons.webp",
  "hydrogen-vehicle-pros-and-cons": "/tech-wire/hydrogen-vehicle-pros-and-cons.webp",
  "best-engine-upgrades-before-more-power": "/tech-wire/best-engine-upgrades-before-more-power.webp",
  "towing-upgrades-that-actually-matter": "/tech-wire/towing-upgrades-that-actually-matter.webp",
  "engine-swap-planning-checklist": "/tech-wire/engine-swap-planning-checklist.webp",
  "cooling-system-upgrades-for-reliability": "/tech-wire/cooling-system-upgrades-for-reliability.webp",
  "turbo-vs-supercharger-street-build": "/tech-wire/turbo-vs-supercharger-street-build.webp",
  "used-engine-buying-checklist": "/tech-wire/used-engine-buying-checklist.webp",
};

export function getTechArticleImage(article: Pick<TechArticle, "slug" | "imageUrl">) {
  return article.imageUrl || builtInArticleCovers[article.slug] || `/tech-wire/${article.slug}/opengraph-image`;
}

