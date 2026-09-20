import type { Metadata } from "next";
import LegalShell from "../legal-shell";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | Any Part & Gear",
  description: "How affiliate links support Any Part & Gear.",
};

export default function AffiliateDisclosurePage() {
  return <LegalShell
    eyebrow="Transparency"
    title="Affiliate Disclosure"
    intro="A simple explanation of how some outside shopping links may support APG."
  >
    <p><strong>Effective September 20, 2026.</strong> Any Part &amp; Gear may use affiliate links to products or resources sold by other companies.</p>
    <h2>Amazon Associates disclosure</h2>
    <p><strong>As an Amazon Associate I earn from qualifying purchases.</strong></p>
    <p>If you follow a qualifying Amazon link from APG and make a purchase, APG may receive a commission at no additional cost to you.</p>
    <h2>Outside purchases</h2>
    <p>Amazon and other outside sellers control their prices, availability, orders, shipping, returns and product information. APG does not process those purchases and does not guarantee availability, fitment or product performance.</p>
    <h2>Marketplace independence</h2>
    <p>Affiliate relationships do not change seller listings or the price a marketplace seller chooses. Buyers should independently verify that a part, manual, tool or other product fits their needs before purchasing.</p>
    <h2>Questions</h2>
    <p>For questions about this disclosure, please use the APG Support page.</p>
  </LegalShell>;
}
