import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, CircleHelp, Clock3, MapPin, Search, ShieldCheck } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";

type PartRequest = { id: string; request_kind: "known_part" | "help_identify"; item_type: string; vehicle_year: number | null; make: string | null; model: string | null; part_name: string | null; description: string; location: string; postal_code: string; search_radius: number; status: string; expires_at: string; created_at: string };

function requestTitle(request: PartRequest) {
  return request.part_name || [request.vehicle_year, request.make, request.model].filter(Boolean).join(" ") || request.item_type;
}

function RequestCard({ request, businessView }: { request: PartRequest; businessView: boolean }) {
  const vehicle = [request.vehicle_year, request.make, request.model].filter(Boolean).join(" ");
  return <article className="part-request-card"><div className="part-request-card-top"><span className={`request-kind ${request.request_kind === "help_identify" ? "identify" : "known"}`}>{request.request_kind === "help_identify" ? <CircleHelp size={15}/> : <Search size={15}/>} {request.request_kind === "help_identify" ? "Help identify" : "Part known"}</span><span className={`request-status ${request.status}`}>{request.status}</span></div><h2><Link href={`/parts-wanted/${request.id}`}>{requestTitle(request)}</Link></h2>{vehicle && <p className="request-vehicle">{vehicle}</p>}<p className="request-excerpt">{request.description}</p><div className="request-meta"><span><MapPin size={15}/>{request.location}{businessView ? ` · ${request.postal_code}` : ""}</span><span><Clock3 size={15}/>{new Date(request.created_at).toLocaleDateString()}</span></div><Link className="button button-small" href={`/parts-wanted/${request.id}`}>{businessView ? "View request" : "View responses"}</Link></article>;
}

export const dynamic = "force-dynamic";

export default async function PartsWantedPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/parts-wanted");
  const supabase = await createClient();
  const { data: shop } = await supabase.from("shops").select("id,name,is_verified,is_active").eq("owner_id", user.id).maybeSingle();
  const verifiedBusiness = Boolean(shop?.is_verified && shop?.is_active);

  const [{ data: myRows }, businessResult] = await Promise.all([
    supabase.from("part_requests").select("id,request_kind,item_type,vehicle_year,make,model,part_name,description,location,postal_code,search_radius,status,expires_at,created_at").eq("requester_id", user.id).order("created_at", { ascending: false }),
    verifiedBusiness
      ? supabase.from("part_requests").select("id,request_kind,item_type,vehicle_year,make,model,part_name,description,location,postal_code,search_radius,status,expires_at,created_at").eq("status", "active").gt("expires_at", new Date().toISOString()).neq("requester_id", user.id).order("created_at", { ascending: false }).limit(100)
      : Promise.resolve({ data: [] }),
  ]);
  const myRequests = (myRows || []) as PartRequest[];
  const businessRequests = (businessResult.data || []) as PartRequest[];

  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/">Marketplace</Link><Link href="/messages">Messages</Link><Link href="/account">My account</Link></nav></div></header><div className="shell page-shell parts-wanted-shell"><div className="parts-wanted-hero"><div><span className="kicker">Local parts search</span><h1 className="page-title">Parts Wanted</h1><p>Post what you need—or ask for help identifying it—and connect privately with verified local businesses.</p></div><Link className="button" href="/parts-wanted/new">Request a part</Link></div>

    {verifiedBusiness ? <section className="parts-wanted-section"><div className="section-heading-row"><div><span className="verified-business-label"><ShieldCheck size={17}/> Verified access for {shop?.name}</span><h2>Local customer requests</h2><p>Respond only when your business can help. Customer phone numbers and email addresses are never displayed.</p></div></div>{businessRequests.length ? <div className="part-request-grid">{businessRequests.map((request) => <RequestCard key={request.id} request={request} businessView />)}</div> : <div className="empty-state"><Building2 size={38}/><h3>No active local requests yet</h3><p>New requests from APG members will appear here.</p></div>}</section> : <section className="business-access-card"><ShieldCheck size={30}/><div><h2>Business request board is locked</h2><p>Only businesses that APG has reviewed can browse and respond to customer requests.</p>{shop ? <p><strong>Your business verification is pending.</strong></p> : <Link href="/shops/register" className="button button-small">Add your business</Link>}</div></section>}

    <section className="parts-wanted-section"><div className="section-heading-row"><div><h2>My requests</h2><p>Only you and verified APG businesses can view these details.</p></div><Link href="/parts-wanted/new">Create another request</Link></div>{myRequests.length ? <div className="part-request-grid">{myRequests.map((request) => <RequestCard key={request.id} request={request} businessView={false} />)}</div> : <div className="empty-state"><Search size={38}/><h3>You haven’t requested a part yet</h3><p>Describe what you need, even if you don’t know the part’s name.</p><Link className="button" href="/parts-wanted/new">Post your first request</Link></div>}</section>
  </div></main>;
}
