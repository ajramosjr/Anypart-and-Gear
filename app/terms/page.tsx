import type { Metadata } from "next";
import LegalShell from "../legal-shell";

export const metadata: Metadata = { title: "Terms of Use | Any Part & Gear", description: "Terms for using the Any Part & Gear marketplace." };

export default function TermsPage() { return <LegalShell eyebrow="Trust & Safety" title="Terms of Use" intro="The rules that help keep Any Part & Gear useful, lawful and fair for buyers and sellers.">
  <p><strong>Effective September 16, 2026.</strong> By accessing or using Any Part &amp; Gear, you agree to these Terms. If you do not agree, do not use the service.</p>
  <h2>1. Marketplace role</h2><p>Any Part &amp; Gear provides classified listings and communication tools. We are not the buyer, seller, payment processor, shipping carrier, mechanic or inspector in a transaction. Buyers and sellers are responsible for evaluating items, fitment, condition, legality, payment, pickup, shipping, taxes, titles and returns.</p>
  <h2>2. Accounts</h2><p>You must provide accurate information, protect your sign-in credentials and use your own account. You are responsible for activity performed through your account. You may not impersonate another person or business, create deceptive accounts or use the service to evade a suspension.</p>
  <h2>3. Listings</h2><p>Listings must be accurate, lawful and for items the seller owns or is authorized to sell. Photos must represent the actual item unless clearly labeled otherwise. Sellers must disclose known material defects and may not manipulate price, location, availability or condition to mislead buyers.</p>
  <h2>4. Prohibited activity</h2><p>You may not post stolen, counterfeit, recalled, unlawfully modified or otherwise illegal goods; weapons or regulated items; fraudulent offers; malware; harassment; spam; or content that violates another person’s rights. See our Community Guidelines for additional examples.</p>
  <h2>5. Transactions and safety</h2><p>Verify the item and the other party before paying. Use a safe public meeting location where appropriate. Never rely on a listing as professional mechanical, safety or legal advice. Any Part &amp; Gear does not guarantee identity, quality, fitment, title, delivery or payment.</p>
  <h2>6. Moderation</h2><p>We may review reports and remove content, restrict features or suspend accounts that violate these Terms or create risk. We are not required to monitor every listing or message and cannot guarantee that every report will result in removal.</p>
  <h2>7. Intellectual property</h2><p>You keep ownership of content you submit. You grant Any Part &amp; Gear a nonexclusive license to host, display, resize and distribute that content as needed to operate and promote the marketplace. Do not upload content you lack permission to use.</p>
  <h2>8. Disclaimers and liability</h2><p>The service is provided “as is” and “as available” to the extent permitted by law. Use of the marketplace and transactions between users are at your own risk. Any Part &amp; Gear is not responsible for indirect losses or for disputes between users, except where liability cannot legally be excluded.</p>
  <h2>9. Changes</h2><p>We may update these Terms as the marketplace develops. Material changes will be posted with a new effective date. Continued use after an update means you accept the revised Terms.</p>
</LegalShell>; }
