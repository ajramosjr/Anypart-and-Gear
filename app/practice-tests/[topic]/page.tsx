import PageMenu from "@/components/page-menu";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ApgLogo from "@/components/apg-logo";
import banks from "../topic-banks.json";
import PracticeSession from "../practice-session";

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const bank = banks.find(item => item.slug === topic);
  return { title: bank ? `${bank.title} Practice | Any Part & Gear` : "Practice Tests | APG", description: bank?.description };
}
export default async function TopicPracticePage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const bank = banks.find(item => item.slug === topic);
  if (!bank) notFound();
  return <main className="min-h-screen bg-[#f3f5f8] text-slate-950">
    <header className="apg-site-header border-b bg-white"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4"><ApgLogo priority/><Link href="/practice-tests" className="font-bold text-[#071a35] underline underline-offset-4">← Practice Tests</Link><PageMenu /></div></header>
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14"><p className="text-xs font-bold uppercase tracking-widest text-amber-700">APG study resources · {bank.category}</p><h1 className="mt-3 text-3xl font-black text-[#071a35] sm:text-5xl">{bank.title} Practice</h1><p className="mt-5 max-w-3xl leading-7 text-slate-600">{bank.description} {bank.questions.length} original APG questions, short lessons and answer explanations.</p>
    <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6">Independent, unofficial learning practice. This is not an official exam, complete training course or certificate. Follow current local requirements and manufacturer instructions, and use qualified instruction for hands-on work.</p>
    <section className="mt-8" aria-labelledby="lessons"><h2 id="lessons" className="text-2xl font-bold text-[#071a35]">Start with a short lesson</h2>{bank.lessons.map(lesson => <details key={lesson.title} className="mt-3 rounded-xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold">{lesson.title}</summary><p className="mt-3 leading-7 text-slate-600">{lesson.body}</p></details>)}</section>
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="resources"><h2 id="resources" className="text-xl font-bold text-[#071a35]">Keep learning</h2><ul className="mt-3 space-y-3">{bank.sources.map(source => <li key={source.url}>{source.url.startsWith("/") ? <Link href={source.url} className="font-semibold text-[#173b72] underline underline-offset-4">{source.label} →</Link> : <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#173b72] underline underline-offset-4">{source.label} ↗</a>}</li>)}</ul><p className="mt-4 text-sm text-slate-600">External resources belong to their respective publishers. Linking does not imply endorsement or affiliation.</p></section>
    <section className="mt-10" aria-labelledby="questions"><h2 id="questions" className="text-2xl font-bold text-[#071a35]">Practice at your own pace</h2><PracticeSession questions={bank.questions}/></section>
    </div>
  </main>;
}
