import type { Metadata } from "next";
import LegalShell from "../legal-shell";

export const metadata: Metadata = { title: "Privacy Policy | Any Part & Gear", description: "How Any Part & Gear handles marketplace information." };

export default function PrivacyPage() { return <LegalShell eyebrow="Your information" title="Privacy Policy" intro="A plain-language overview of the information used to operate the marketplace.">
  <p><strong>Effective September 16, 2026.</strong> This policy explains how Any Part &amp; Gear handles information when you use the marketplace.</p>
  <h2>Information we collect</h2><p>We collect account details such as your name and email address; listings, photos and shop information you submit; messages and reports sent through the platform; and basic technical information needed for security, diagnostics and service operation.</p>
  <h2>How we use information</h2><p>We use information to create and secure accounts, publish listings, deliver private messages, respond to reports, prevent fraud, maintain the service and understand how features perform.</p>
  <h2>What is public</h2><p>Listing information, seller display names, approximate listing locations and public shop profiles may be visible to anyone. Your account email address and private message contents are not displayed publicly.</p>
  <h2>Service providers</h2><p>We use service providers to host the website, authenticate users, store marketplace data and deliver infrastructure. These providers process information under their own contractual and security obligations. We do not sell your personal information.</p>
  <h2>Sharing</h2><p>We may disclose information when you direct us to, when needed to operate the service, to investigate abuse or fraud, or when required by law. Messages may be reviewed when reported for safety or policy enforcement.</p>
  <h2>Retention and security</h2><p>We retain information for as long as reasonably needed to operate the service, resolve disputes, enforce policies and meet legal obligations. We use access controls and encrypted connections, but no online system can guarantee absolute security.</p>
  <h2>Your choices</h2><p>You may update certain account and listing information through the service. You may request account or data assistance through the Support page. Some records may be retained when required for fraud prevention, safety or legal compliance.</p>
  <h2>Children</h2><p>The marketplace is not directed to children under 13, and children under 13 may not create accounts.</p>
  <h2>Policy updates</h2><p>We may revise this policy as the service changes. The effective date above will be updated when material revisions are posted.</p>
</LegalShell>; }
