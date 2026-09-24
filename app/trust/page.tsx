import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "../legal-shell";

export const metadata: Metadata = {
  title: "Trust & Transparency | Any Part & Gear",
  description: "How APG verification, marketplace safety, reports and direct transactions work.",
};

export default function TrustPage() {
  return <LegalShell
    eyebrow="How APG works"
    title="Trust & Transparency"
    intro="Clear expectations help buyers, sellers and businesses use Any Part & Gear with confidence."
  >
    <h2>What APG is</h2>
    <p>Any Part &amp; Gear LLC provides a marketplace where individuals and businesses can publish listings, request parts and communicate directly. APG does not own the listed inventory and is not the buyer or seller in marketplace transactions.</p>

    <h2>What verification means</h2>
    <p>Email verification confirms that a member completed APG’s email-confirmation process. A trusted-seller badge reflects account information and marketplace history reviewed by APG. A verified-business badge means APG reviewed specified public business information, such as the business name, location and public presence.</p>
    <p><strong>A badge is not a guarantee.</strong> It does not certify every item, promise fitment or guarantee that a transaction will be completed. Buyers should independently inspect items and confirm seller information.</p>

    <h2>Listings and reports</h2>
    <p>Sellers are responsible for accurate titles, current photographs, honest condition descriptions, prices, part numbers and compatibility information. APG may review, restrict or remove content when it is reported, appears unsafe or violates marketplace rules. APG does not claim that every listing is inspected before publication.</p>

    <h2>Payments, pickup and shipping</h2>
    <p>Buyers and sellers arrange payment, pickup and shipping directly. APG does not hold funds, process marketplace payments, arrange delivery, guarantee returns or determine whether a part fits a particular vehicle. Avoid gift cards, cryptocurrency demands, wire transfers and pressure to pay before inspecting an item.</p>

    <h2>Privacy and communication</h2>
    <p>APG provides private messaging so members can discuss listings without publishing personal contact information. Never share passwords, email verification codes or sensitive financial information in messages.</p>

    <h2>Our responsibility</h2>
    <p>APG is committed to explaining how the marketplace works, applying its rules consistently and giving members clear ways to report concerns. Trust is built through accurate listings, responsible sellers, informed buyers and transparent platform practices.</p>

    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/safety" className="support-primary rounded-md bg-[#0b2345] px-5 py-3 font-bold">Read safety tips</Link>
      <Link href="/community-guidelines" className="rounded-md border border-slate-300 px-5 py-3 font-bold">Marketplace rules</Link>
      <Link href="/support" className="rounded-md border border-slate-300 px-5 py-3 font-bold">Get support</Link>
    </div>
  </LegalShell>;
}
