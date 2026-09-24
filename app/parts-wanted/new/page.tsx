import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import ApgLogo from "@/components/apg-logo";
import RequestForm from "./request-form";

export default async function NewPartRequestPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/parts-wanted/new");

  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><Link href="/parts-wanted">Parts Wanted</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Local parts search</span><h1 className="page-title">What are you looking for?</h1><p>Post one request and let verified local businesses tell you whether they have it—or help identify what you need.</p></div><div className="card-panel"><RequestForm userId={user.id} /></div></div></main>;
}
