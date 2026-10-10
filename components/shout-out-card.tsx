import { ExternalLink, Heart } from "lucide-react";
import { safeShoutOutUrl, type ShoutOut } from "@/lib/shout-outs";

export default function ShoutOutCard({ item, preview = false }: { item: Pick<ShoutOut, "name" | "description" | "website_url" | "image_url">; preview?: boolean }) {
  const website = safeShoutOutUrl(item.website_url);
  const image = safeShoutOutUrl(item.image_url);
  return <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    {image ? <img src={image} alt={item.name + " logo or photo"} className="mb-5 h-32 w-full rounded-lg object-contain" referrerPolicy="no-referrer" /> : <Heart className="mb-5 text-[#a77c16]" size={32} aria-hidden="true" />}
    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Check this out</span>
    <h2 className="mt-2 text-2xl font-black">{item.name || "Shout-out name"}</h2>
    <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{item.description || "Tell visitors why you appreciate them."}</p>
    {website && <a href={website} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 font-black" style={{ backgroundColor: "#e6b944", color: "#071a35" }}>Check them out <ExternalLink size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
    <p className="mt-4 text-sm text-slate-500">{preview ? "Private preview — publish to share this on APG." : "An independent shout-out from APG."}</p>
  </article>;
}
