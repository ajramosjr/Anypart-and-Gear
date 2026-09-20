"use client";

import { Link2, Mail, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://www.anypartandgear.com/tech-wire/${slug}`;
  const share = async () => {
    if (navigator.share) { await navigator.share({ title, url }); return; }
    await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };

  return <div className="mt-6 flex flex-wrap gap-2" aria-label="Share this article">
    <button type="button" onClick={() => void share()} className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2.5 text-sm font-black text-[#071a35] hover:bg-amber-300"><Share2 className="size-4" /> Share</button>
    <button type="button" onClick={() => void navigator.clipboard.writeText(url).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); })} className="inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"><Link2 className="size-4" /> {copied ? "Copied" : "Copy link"}</button>
    <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className="article-share-link inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2.5 text-sm font-bold hover:bg-white/10"><Mail className="size-4" /> Email</a>
  </div>;
}
