import type { Metadata } from "next";
import LegalShell from "../legal-shell";

export const metadata: Metadata = { title: "Community Guidelines | Any Part & Gear", description: "Listing and conduct rules for the Any Part & Gear community." };

export default function GuidelinesPage() { return <LegalShell eyebrow="Marketplace rules" title="Community Guidelines" intro="Post honestly, communicate respectfully and help keep unsafe or illegal goods off the marketplace.">
  <h2>Be accurate</h2><p>Use current photos, an honest condition, a real price and a useful description. Disclose known damage, missing pieces and fitment limitations. Do not post unavailable items merely to collect leads.</p>
  <h2>Prohibited listings</h2><ul><li>Stolen goods or items with removed or altered identification numbers</li><li>Counterfeit parts, forged documents or deceptive replicas</li><li>Recalled products that cannot legally be resold</li><li>Weapons, explosives, controlled substances or other regulated goods</li><li>Defeat devices or modifications whose sale is unlawful</li><li>Fraudulent titles, VIN services or identity documents</li><li>Unsafe items presented as roadworthy or certified</li><li>Spam, unrelated services, pyramid schemes or deceptive affiliate links</li></ul>
  <h2>Respect privacy</h2><p>Use private messaging instead of posting personal phone numbers or addresses. Do not publish another person’s private information, threaten users or pressure someone to communicate outside the platform.</p>
  <h2>Trade safely</h2><p>Inspect items before paying when possible. Confirm part numbers, measurements, title status and compatibility independently. Avoid gift cards, cryptocurrency demands, wire transfers and overpayment schemes. Meet in a safe location and bring another person for high-value exchanges.</p>
  <h2>Businesses and promotions</h2><p>Businesses must represent their identity and inventory truthfully. Sponsored, affiliate or paid content must be clearly labeled. A verified badge means the platform reviewed specified business information; it is not a guarantee of workmanship or every transaction.</p>
  <h2>Enforcement</h2><p>Use the Report listing control when something appears unsafe, deceptive or prohibited. We may remove content or restrict accounts based on the information available, repeated violations and potential harm.</p>
</LegalShell>; }
