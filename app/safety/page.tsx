import Link from "next/link";
import { BadgeCheck, CreditCard, MapPin, PackageCheck, ShieldAlert, Wrench } from "lucide-react";
import ApgLogo from "@/components/apg-logo";

const tips = [
  { icon: MapPin, title: "Meet in a safe place", text: "Use a busy, well-lit public location. Bring another person and tell someone where you are going." },
  { icon: Wrench, title: "Verify fitment", text: "Check part numbers, measurements and vehicle details yourself. Never rely only on the listing title." },
  { icon: PackageCheck, title: "Inspect before paying", text: "Look for damage, missing pieces and signs that photos do not match the actual item." },
  { icon: CreditCard, title: "Protect your payment", text: "Avoid gift cards, wire transfers and pressure to pay immediately. Never share verification codes." },
  { icon: BadgeCheck, title: "Check the seller", text: "Review the profile, ask clear questions and walk away if the story or deal does not feel right." },
  { icon: ShieldAlert, title: "Report suspicious activity", text: "Save messages and listing details. Report fraud attempts and contact local authorities when appropriate." },
];
export default function SafetyPage() { return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/">Back to marketplace</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Trade with confidence</span><h1 className="page-title">Marketplace safety</h1><p>Most exchanges go smoothly when buyers and sellers slow down, verify the details and meet safely.</p></div><div className="safety-grid">{tips.map(({ icon: Icon, title, text }) => <article className="safety-tip" key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div></div></main>; }
