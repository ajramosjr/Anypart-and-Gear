"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { TechArticle } from "./articles";

const categories = ["All", "New tool watch", "Future vehicles", "Engine upgrades", "Reliability", "Trucks & towing", "Buying guide", "Tool buying guide", "Build planning", "Forced induction"];

export default function ArticleBrowser({ articles }: { articles: TechArticle[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const search = query.trim().toLowerCase();
    return articles.filter((article) => (category === "All" || article.category === category) && (!search || `${article.title} ${article.summary} ${article.category}`.toLowerCase().includes(search)));
  }, [articles, category, query]);

  return <>
    <div className="mt-8 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <label className="flex h-12 items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-4 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200">
        <Search className="size-5 text-slate-500" /><span className="sr-only">Search Tech Wire articles</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search engines, tools, upgrades and future vehicles…" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X className="size-5 text-slate-500" /></button>}
      </label>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Article categories">
        {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black ${category === item ? "border-[#071a35] bg-[#071a35] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-amber-500"}`}>{item}</button>)}
      </div>
    </div>
    <p className="mt-5 text-sm font-bold text-slate-600">{shown.length} {shown.length === 1 ? "article" : "articles"}</p>
    {shown.length ? <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {shown.map((article) => {
        const isNew = articles.indexOf(article) < 5;
        return <Link key={article.slug} href={`/tech-wire/${article.slug}`} className="group flex min-h-72 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl">
          <div className="h-2 bg-amber-400" />
          <div className="flex flex-1 flex-col p-6"><div className="flex items-center justify-between gap-2"><span className="text-xs font-black uppercase tracking-[.14em] text-amber-700">{article.category}</span>{isNew && <span className="rounded-full bg-[#071a35] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">New</span>}</div><h3 className="mt-3 text-2xl font-black leading-tight text-[#071a35] group-hover:text-amber-700">{article.title}</h3><p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{article.summary}</p><div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-bold text-slate-500"><span>{article.readTime}</span><span className="inline-flex items-center gap-1 text-blue-900">Read article <ArrowRight className="size-4" /></span></div></div>
        </Link>;
      })}
    </div> : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center"><Search className="mx-auto size-8 text-slate-400" /><h3 className="mt-3 font-black text-[#071a35]">No matching articles</h3><button type="button" onClick={() => { setCategory("All"); setQuery(""); }} className="mt-3 text-sm font-bold text-blue-900 underline">Show all articles</button></div>}
  </>;
}
