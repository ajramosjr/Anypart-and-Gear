import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, ExternalLink, Lightbulb, ShieldCheck, Wrench } from "lucide-react";
import { techArticles } from "../articles";
import { getPublishedTechArticle, getPublishedTechArticles, getTechArticleImage } from "../article-store";
import { notFound } from "next/navigation";
import ShareButtons from "./share-buttons";
export const revalidate = 300;

export function generateStaticParams() {
  return techArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getPublishedTechArticle(slug);
  if (!article) return {};
  const url = `/tech-wire/${article.slug}`;
  return { title: `${article.title} | APG Tech Wire`, description: article.summary, alternates: { canonical: url }, openGraph: { type: "article", title: article.title, description: article.summary, url, siteName: "APG Tech Wire", publishedTime: "2026-09-17T00:00:00Z", images: [{ url: getTechArticleImage(article), width: 1200, height: 630, alt: article.title }] } };
}

export default async function TechArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const [article, allArticles] = await Promise.all([getPublishedTechArticle(slug), getPublishedTechArticles()]);
  if (!article) notFound();
  const related = allArticles.filter(({ slug }) => slug !== article.slug).slice(0, 3);
  const articleImage = getTechArticleImage(article);
  const advantages = article.sections.find((section) => /advantage|benefit|pros/i.test(section.heading));
  const tradeoffs = article.sections.find((section) => /tradeoff|limitation|concern|cons/i.test(section.heading));
  const apgTake = article.sections.find((section) => /apg take/i.test(section.heading));
  const guideSections = article.sections.filter((section) => section !== advantages && section !== tradeoffs && section !== apgTake);
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.summary, image: articleImage.startsWith("http") ? articleImage : `https://www.anypartandgear.com${articleImage}`, datePublished: "2026-09-17", dateModified: "2026-09-17", mainEntityOfPage: `https://www.anypartandgear.com/tech-wire/${article.slug}`, author: { "@type": "Organization", name: "Any Part & Gear" }, publisher: { "@type": "Organization", name: "Any Part & Gear", logo: { "@type": "ImageObject", url: "https://www.anypartandgear.com/apg-logo.webp" } } };

  return <main className="min-h-screen bg-[#e9edf1] text-slate-950">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
    <header className="border-b border-slate-300 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Any Part and Gear home"><Image src="/apg-logo.webp" alt="Any Part and Gear" width={172} height={50} className="h-12 w-auto object-contain" priority /></Link>
        <Link href="/tech-wire" className="inline-flex items-center gap-2 rounded-md border border-amber-500 bg-amber-400 px-4 py-2.5 text-sm font-extrabold text-[#071a35] hover:bg-amber-300"><ArrowLeft className="size-4" /> Tech Wire</Link>
      </div>
    </header>

    <article>
      <section className="border-b-4 border-amber-400 bg-[#071a35] text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <img src={articleImage} alt={article.title} className="mb-9 aspect-[1200/630] w-full rounded-xl border border-white/15 object-cover shadow-2xl" />
          <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[.16em] text-amber-400"><Wrench className="size-5" /> {article.category}</div>
          <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-[1.02] sm:text-6xl">{article.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{article.summary}</p>
          <div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-slate-300"><span>{article.published}</span><span className="inline-flex items-center gap-1.5"><Clock className="size-4" />{article.readTime}</span></div>
          <ShareButtons title={article.title} slug={article.slug} />
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_17rem]">
        <div className="rounded-2xl border border-slate-300 bg-[#f8fafc] p-4 shadow-lg sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#071a35] text-amber-400"><Wrench className="size-5" /></span>
            <div><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">APG garage guide</p><h2 className="mt-1 text-2xl font-black text-[#071a35]">What you need to know</h2></div>
          </div>

          <div className="grid gap-5">
            {guideSections.map((section) => <section key={section.heading} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="flex items-start gap-3 text-xl font-black leading-tight text-[#071a35] sm:text-2xl"><span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-amber-400 ring-4 ring-amber-100" />{section.heading}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{section.body}</p>
              {section.bullets && <ul className="mt-5 grid gap-3 sm:grid-cols-2">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber-600" />{bullet}</li>)}</ul>}
            </section>)}
          </div>

          {apgTake && <section className="mt-6 rounded-xl border-2 border-amber-400 bg-[#071a35] p-6 text-white shadow-md">
            <h2 className="flex items-center gap-3 text-xl font-black text-amber-400 sm:text-2xl"><Lightbulb className="size-6" />{apgTake.heading}</h2>
            <p className="mt-3 text-base leading-7 text-slate-200">{apgTake.body}</p>
            {apgTake.bullets && <ul className="mt-4 grid gap-2">{apgTake.bullets.map((bullet) => <li key={bullet} className="flex gap-2 text-sm leading-6 text-slate-200"><CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-400" />{bullet}</li>)}</ul>}
          </section>}

          {(advantages || tradeoffs) && <div className="mt-6 grid gap-5 md:grid-cols-2">
            {advantages && <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="flex items-center gap-2 text-xl font-black text-emerald-950"><CheckCircle2 className="size-5 text-emerald-600" />{advantages.heading}</h2>
              <p className="mt-3 text-sm leading-6 text-emerald-950/75">{advantages.body}</p>
              {advantages.bullets && <ul className="mt-4 grid gap-2">{advantages.bullets.map((bullet) => <li key={bullet} className="flex gap-2 text-sm font-semibold leading-6 text-emerald-950"><span aria-hidden="true">•</span>{bullet}</li>)}</ul>}
            </section>}
            {tradeoffs && <section className="rounded-xl border border-amber-300 bg-amber-50 p-5">
              <h2 className="flex items-center gap-2 text-xl font-black text-amber-950"><AlertTriangle className="size-5 text-amber-700" />{tradeoffs.heading}</h2>
              <p className="mt-3 text-sm leading-6 text-amber-950/75">{tradeoffs.body}</p>
              {tradeoffs.bullets && <ul className="mt-4 grid gap-2">{tradeoffs.bullets.map((bullet) => <li key={bullet} className="flex gap-2 text-sm font-semibold leading-6 text-amber-950"><span aria-hidden="true">•</span>{bullet}</li>)}</ul>}
            </section>}
          </div>}

          {article.sources && article.sources.length > 0 && <section className="mt-8 border-t border-slate-200 pt-7"><h2 className="text-lg font-black text-[#071a35]">Official resources</h2><div className="mt-3 grid gap-2">{article.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-amber-700">{source.label}<ExternalLink className="size-4" /></a>)}</div></section>}
          <div className="mt-8 rounded-lg border border-amber-300 bg-white p-5 text-sm leading-6 text-slate-700"><strong className="flex items-center gap-2 text-[#071a35]"><ShieldCheck className="size-5 text-amber-700" /> Work safely</strong><p className="mt-2">Specifications and procedures vary by vehicle. Follow the manufacturer’s service information and use a qualified professional for work beyond your training or equipment.</p></div>
        </div>
        <aside><div className="sticky top-5 rounded-xl bg-[#0b2345] p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-amber-400">Read next</p>{related.map((item) => <Link key={item.slug} href={`/tech-wire/${item.slug}`} className="tech-related-link"><span>{item.category}</span><strong>{item.title}</strong></Link>)}</div></aside>
      </div>
    </article>

    <section className="bg-[#071a35] text-white"><div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-10 sm:px-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-amber-400">Find the parts</p><h2 className="mt-1 text-2xl font-black">Turn the plan into a build.</h2></div><Link href="/#listings" className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 font-black text-[#071a35] hover:bg-amber-300">Browse marketplace <ArrowRight className="size-4" /></Link></div></section>
  </main>;
}
