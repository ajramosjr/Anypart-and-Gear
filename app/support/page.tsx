import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "../legal-shell";

export const metadata: Metadata = { title: "Support | Any Part & Gear", description: "Get account, listing and marketplace safety help." };

export default function SupportPage() { return <LegalShell eyebrow="We’re here to help" title="Support" intro="Find the right next step for account, listing and safety concerns.">
  <h2>Report a listing</h2><p>Open the listing and select <strong>Report this listing</strong>. Signed-in members can identify the reason and add details for review.</p>
  <h2>Account and sign-in help</h2><p>Use the sign-in screen to create an account or request a new confirmation link. Never send anyone your password or email verification code.</p>
  <h2>Immediate danger or suspected crime</h2><p>Do not use the marketplace report tool for emergencies. Contact local emergency services or the appropriate law-enforcement agency. Preserve relevant listing and message details.</p>
  <h2>Transaction disputes</h2><p>Any Part &amp; Gear does not process payments or take possession of items. First contact the other party through private messages and preserve receipts, photos and payment records. Contact your payment provider promptly if you suspect fraud.</p>
  <div className="mt-8 flex flex-wrap gap-3"><Link href="/safety" className="support-primary rounded-md bg-[#0b2345] px-5 py-3 font-bold">Read safety tips</Link><Link href="/community-guidelines" className="rounded-md border border-slate-300 px-5 py-3 font-bold">View marketplace rules</Link></div>
</LegalShell>; }
