"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
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
    <Link href={`/tech-wire/${article.slug}`} className="inline-flex items-center gap-1.5 rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-black !text-[#071a35] shadow-sm hover:bg-amber-300 hover:!text-[#071a35]">Read APG article <ArrowRight className="size-4" /></Link>
    {source && <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-black text-[#071a35] shadow-sm hover:bg-amber-300">Original source <ExternalLink className="size-4" /></a>}
  </div>;
}

export default function ArticleBrowser({ articles }: { articles: TechArticle[] }) {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const shown = useMemo(() => {
    const search = query.trim().toLowerCase();
    return articles.filter((article) => (category === "All" || articleGroup(article) === category) && (!search || `${article.title} ${article.summary} ${article.category} ${article.sources?.map((source) => source.label).join(" ") || ""}`.toLowerCase().includes(search)));
  }, [articles, category, query]);

  const safeIndex = shown.length ? Math.min(activeIndex, shown.length - 1) : 0;
  const activeArticle = shown[safeIndex];

  function selectCategory(item: Category) {
    setCategory(item);
    setActiveIndex(0);
  }

  function previousArticle() {
    setActiveIndex((index) => index <= 0 ? shown.length - 1 : index - 1);
  }

  function nextArticle() {
    setActiveIndex((index) => index >= shown.length - 1 ? 0 : index + 1);
  }

  return <>
    <div className="mt-8 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <label className="flex h-12 items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-4 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200">
        <Search className="size-5 text-slate-500" /><span className="sr-only">Search APG Tech Wire</span>
        <input value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} placeholder="Search a headline, topic or source…" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
        {query && <button type="button" onClick={() => { setQuery(""); setActiveIndex(0); }} aria-label="Clear search" className="rounded-full bg-amber-400 p-1 text-[#071a35] hover:bg-amber-300"><X className="size-4" /></button>}
      </label>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="News categories">
        {categories.map((item) => <button type="button" key={item} onClick={() => selectCategory(item)} aria-pressed={category === item} className={`whitespace-nowrap rounded-full bg-amber-400 px-4 py-2 text-xs font-black text-[#071a35] shadow-sm hover:bg-amber-300 ${category === item ? "border-2 border-[#071a35]" : "border border-amber-500"}`}>{item}</button>)}
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between gap-4">
      <p className="text-sm font-bold text-slate-600">{shown.length} {shown.length === 1 ? "story" : "stories"} in {category}</p>
      {category !== "All" && <button type="button" onClick={() => selectCategory("All")} className="rounded-md border border-amber-500 bg-amber-400 px-3 py-2 text-sm font-black text-[#071a35] shadow-sm hover:bg-amber-300">View all news</button>}
    </div>
    {activeArticle ? <>
      <article className="mt-4 grid overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative min-h-64 overflow-hidden border-b-4 border-amber-400 bg-[#071a35] lg:min-h-96 lg:border-b-0 lg:border-r-4"><img src={getTechArticleImage(activeArticle)} alt={`${activeArticle.title} cover`} className="absolute inset-0 h-full w-full object-cover" /></div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2"><span className="rounded bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#071a35]">Story {safeIndex + 1} of {shown.length}</span><span className="text-xs font-black uppercase tracking-[.14em] text-amber-700">{activeArticle.category}</span></div>
          <h3 className="mt-4 text-3xl font-black leading-tight text-[#071a35] sm:text-4xl">{activeArticle.title}</h3>
          <p className="mt-4 text-base leading-7 text-slate-600">{activeArticle.summary}</p>
          <div className="mt-5"><SourceLine article={activeArticle} /></div><ArticleActions article={activeArticle} />
        </div>
      </article>
      <div className="mt-5 flex items-center justify-between gap-3" aria-label="Article navigation">
        <button type="button" onClick={previousArticle} className="inline-flex items-center gap-2 rounded-md border border-amber-500 bg-amber-400 px-4 py-3 text-sm font-black text-[#071a35] shadow-sm hover:bg-amber-300" aria-label="Previous article"><ChevronLeft className="size-5" /> Previous</button>
        <span className="min-w-16 text-center text-sm font-black text-slate-600 sm:hidden" aria-label={`Article ${safeIndex + 1} of ${shown.length}`}>{safeIndex + 1} / {shown.length}</span>
        <div className="hidden max-w-xl flex-wrap justify-center gap-2 sm:flex" aria-label={`Article ${safeIndex + 1} of ${shown.length}`}>
          {shown.map((article, index) => <button type="button" key={article.slug} onClick={() => setActiveIndex(index)} aria-label={`Show article ${index + 1}: ${article.title}`} aria-current={index === safeIndex ? "true" : undefined} className={`h-2.5 rounded-full transition-all ${index === safeIndex ? "w-8 bg-amber-500" : "w-2.5 bg-amber-200 hover:bg-amber-400"}`} />)}
        </div>
        <button type="button" onClick={nextArticle} className="inline-flex items-center gap-2 rounded-md border border-amber-500 bg-amber-400 px-4 py-3 text-sm font-black text-[#071a35] shadow-sm hover:bg-amber-300" aria-label="Next article">Next <ChevronRight className="size-5" /></button>
      </div>
    </> : <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center"><Search className="mx-auto size-8 text-slate-400" /><h3 className="mt-3 font-black text-[#071a35]">No matching stories yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">APG will add coverage here as reliable stories and sources become available.</p><button type="button" onClick={() => { setCategory("All"); setQuery(""); setActiveIndex(0); }} className="mt-4 rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-black text-[#071a35] shadow-sm hover:bg-amber-300">Show all news</button></div>}
  </>;
}
