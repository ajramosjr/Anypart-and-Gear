import Image from "next/image";
import Link from "next/link";

export default function LegalShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#eef1f4] text-slate-900">
    <header className="border-b border-slate-300 bg-white">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Any Part and Gear home"><Image src="/apg-logo.webp" alt="Any Part and Gear" width={172} height={50} className="h-12 w-auto object-contain" priority /></Link>
        <Link href="/" className="legal-back rounded-md bg-[#0b2345] px-4 py-2.5 text-sm font-bold hover:bg-[#123f66]">Back to marketplace</Link>
      </div>
    </header>
    <section className="border-b-4 border-amber-400 bg-[#071a35] text-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16"><p className="text-xs font-black uppercase tracking-[.18em] text-amber-400">{eyebrow}</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-black uppercase tracking-tight sm:text-6xl">{title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{intro}</p></div>
    </section>
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14"><div className="legal-content rounded-xl border border-slate-300 bg-white p-6 shadow-sm sm:p-10">{children}</div></article>
    <footer className="border-t-4 border-amber-400 bg-[#06162d] text-slate-300"><div className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-3 px-4 py-8 text-sm sm:px-6"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/community-guidelines">Community Guidelines</Link><Link href="/safety">Safety</Link><Link href="/support">Support</Link></div></footer>
  </main>;
}
