"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { TechArticle } from "./articles";
import { getTechArticleImage } from "./article-store";

const categories = ["All", "Cars", "Boats", "Trucking & Buses", "Fuel Prices", "Parts", "Tools"] as const;
type Category = (typeof categories)[number];

function articleGroup(article: TechArticle): Exclude<Category, "All"> {
  const text = `${article.category} ${article.title} ${article.summary}`.toLowerCase();
  if (/boat|marine|outboard|inboard|watercraft/.test(text)) return "Boats";
  if (/truck|towing|trailer|bus|fleet|diesel/.test(text)) return "Trucking & Buses";
  if (/fuel price|gas price|diesel price|gasoline price/.test(text)) return "Fuel Prices";
  if (/tool|battery platform|drill|impact|sander|nailer|vacuum/.test(text)) return "Tools";
  if (/part|engine|reliability|supply chain|forced induction|turbo|supercharger|cooling|swap|build planning/.test(text)) return "Parts";
  return "Cars";
}

function SourceLine({ article }: { article: TechArticle }) {
  const source = article.sources?.[0];
  return <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
    <span>{article.published}</span>
    {source && <><span aria-hidden="true">•</span><span className="truncate">Source: {source.label}</span></>}
  </div>;
}

function ArticleActions({ article }: { article: TechArticle }) {
  const source = article.sources?.[0];
  return <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
    <Link href={`/tech-wire/${article.slug}`} className="inline-flex items-center gap-1.5 rounded-md bg-[#071a35] px-4 py-2.5 text-sm font-black text-white hover:bg-[#12345f]">Read APG article <ArrowRight className="size-4" /></Link>
    {source && <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-[#071a35] hover:border-amber-500">Original source <ExternalLink className="size-4" /></a>}
  </div>;
}

export default function ArticleBrowser({ articles }: { articles: TechArticle[] }) {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const shown = useMemo(() => {
    const search = query.trim().toLowerCase();
    return articles.filter((article) => (category === "All" || articleGroup(article) === category) && (!search || `${article.title} ${article.summary} ${article.category} ${article.sources?.map((source) => source.label).join(" ") || ""}`.toLowerCase().includes(search)));
  }, [articles, category, query]);

  useEffect(() => setVisibleCount(3), [category, query]);

  const featured = shown[0];
  const newest = shown.slice(1, 1 + visibleCount);
  const remaining = Math.max(0, shown.length - 1 - newest.length);

  return <>
    <div className="mt-8 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <label className="flex h-12 items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-4 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200">
        <Search className="size-5 text-slate-500" /><span className="sr-only">Search APG Tech Wire</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a headline, topic or source…" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X className="size-5 text-slate-500" /></button>}
      </label>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="News categories">
        {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black ${category === item ? "border-[#071a35] bg-[#071a35] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-amber-500"}`}>{item}</button>)}
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between gap-4">
      <p className="text-sm font-bold text-slate-600">{shown.length} {shown.length === 1 ? "story" : "stories"} in {category}</p>
      {category !== "All" && <button type="button" onClick={() => setCategory("All")} className="text-sm font-black text-blue-900 underline">View all news</button>}
    </div>
    {featured ? <>
      <article className="mt-4 grid overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative min-h-64 overflow-hidden border-b-4 border-amber-400 bg-[#071a35] lg:min-h-96 lg:border-b-0 lg:border-r-4"><img src={getTechArticleImage(featured)} alt="" className="absolute inset-0 h-full w-full object-cover" /></div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2"><span className="rounded bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#071a35]">Featured story</span><span className="text-xs font-black uppercase tracking-[.14em] text-amber-700">{featured.category}</span></div>
          <h3 className="mt-4 text-3xl font-black leading-tight text-[#071a35] sm:text-4xl">{featured.title}</h3>
          <p className="mt-4 text-base leading-7 text-slate-600">{featured.summary}</p>
          <div className="mt-5"><SourceLine article={featured} /></div><ArticleActions article={featured} />
        </div>
      </article>
      {!!newest.length && <div className="mt-9"><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Fresh coverage</p><h3 className="mt-1 text-2xl font-black text-[#071a35]">Newest stories</h3></div>}
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {newest.map((article) => <article key={article.slug} className="flex min-h-72 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl">
          <Link href={`/tech-wire/${article.slug}`} className="group block"><div className="relative aspect-[1200/630] overflow-hidden border-b-4 border-amber-400 bg-[#071a35]"><img src={getTechArticleImage(article)} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]" /></div></Link>
          <div className="flex flex-1 flex-col p-6"><span className="text-xs font-black uppercase tracking-[.14em] text-amber-700">{article.category}</span><h4 className="mt-3 text-2xl font-black leading-tight text-[#071a35]">{article.title}</h4><p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{article.summary}</p><div className="mt-4"><SourceLine article={article} /></div><ArticleActions article={article} /></div>
        </article>)}
      </div>
      {remaining > 0 && <div className="mt-8 text-center"><button type="button" onClick={() => setVisibleCount((count) => count + 6)} className="rounded-md border-2 border-[#071a35] bg-white px-7 py-3 font-black text-[#071a35] shadow-sm hover:bg-[#071a35] hover:text-white">Load more stories ({remaining})</button></div>}
    </> : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center"><Search className="mx-auto size-8 text-slate-400" /><h3 className="mt-3 font-black text-[#071a35]">No matching stories yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">APG will add coverage here as reliable stories and sources become available.</p><button type="button" onClick={() => { setCategory("All"); setQuery(""); }} className="mt-4 text-sm font-bold text-blue-900 underline">Show all news</button></div>}
  </>;
}
