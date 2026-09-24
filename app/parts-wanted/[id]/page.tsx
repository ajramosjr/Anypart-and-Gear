import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, CircleHelp, Clock3, MapPin, Search, ShieldCheck } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";
import { BusinessResponseForm, ClosePartRequest, ContactRespondingShop } from "../request-actions";

type PartRequest = { id: string; requester_id: string; request_kind: "known_part" | "help_identify"; item_type: string; vehicle_year: number | null; make: string | null; model: string | null; part_name: string | null; description: string; location: string; postal_code: string; search_radius: number; condition_preference: string; image_paths: string[]; status: string; expires_at: string; created_at: string };
type Response = { id: string; shop_id: string; responder_id: string; availability: string; message: string; price: number | null; created_at: string; shops: { name: string; location: string; is_verified: boolean } | null };

function requestTitle(request: PartRequest) {
  return request.part_name || [request.vehicle_year, request.make, request.model].filter(Boolean).join(" ") || request.item_type;
}

export const dynamic = "force-dynamic";

export default async function PartRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  const { id } = await params;
  if (!user) redirect(`/login?next=/parts-wanted/${id}`);
  const supabase = await createClient();
  const [{ data: requestRow }, { data: shop }] = await Promise.all([
    supabase.from("part_requests").select("id,requester_id,request_kind,item_type,vehicle_year,make,model,part_name,description,location,postal_code,search_radius,condition_preference,image_paths,status,expires_at,created_at").eq("id", id).maybeSingle(),
    supabase.from("shops").select("id,name,is_verified,is_active").eq("owner_id", user.id).maybeSingle(),
  ]);
  if (!requestRow) notFound();
  const request = requestRow as PartRequest;
  const isOwner = request.requester_id === user.id;
  const verifiedBusiness = Boolean(shop?.is_verified && shop?.is_active);
  if (!isOwner && !verifiedBusiness && user.app_metadata?.role !== "admin") notFound();

  const { data: responseRows } = await supabase.from("part_request_responses").select("id,shop_id,responder_id,availability,message,price,created_at,shops(name,location,is_verified)").eq("request_id", request.id).order("created_at", { ascending: true });
  const responses = (responseRows || []) as unknown as Response[];
  const ownResponse = responses.find((response) => response.responder_id === user.id);
  const signedImages = request.image_paths.length
    ? (await supabase.storage.from("part-request-images").createSignedUrls(request.image_paths, 600)).data || []
    : [];
  const vehicle = [request.vehicle_year, request.make, request.model].filter(Boolean).join(" ");
  const title = requestTitle(request);
  const active = request.status === "active" && new Date(request.expires_at) > new Date();

  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/parts-wanted">Parts Wanted</Link><Link href="/messages">Messages</Link></nav></div></header><div className="shell page-shell request-detail-shell">
    <Link href="/parts-wanted" className="back-link">← Back to Parts Wanted</Link>
    <div className="request-detail-heading"><div><span className={`request-kind ${request.request_kind === "help_identify" ? "identify" : "known"}`}>{request.request_kind === "help_identify" ? <CircleHelp size={16}/> : <Search size={16}/>} {request.request_kind === "help_identify" ? "Help identifying a part" : "Known part request"}</span><h1 className="page-title">{title}</h1>{vehicle && <p className="request-detail-vehicle">{vehicle}</p>}</div><span className={`request-status ${active ? "active" : request.status}`}>{active ? "active" : request.status === "active" ? "expired" : request.status}</span></div>

    <div className="request-detail-grid"><article className="request-detail-card"><h2>Request details</h2><p className="request-description">{request.description}</p><dl className="request-facts"><div><dt>Category</dt><dd>{request.item_type}</dd></div><div><dt>Condition</dt><dd>{request.condition_preference}</dd></div><div><dt>Area</dt><dd><MapPin size={16}/>{request.location} · {request.postal_code}</dd></div><div><dt>Search radius</dt><dd>Within {request.search_radius} miles</dd></div><div><dt>Posted</dt><dd><CalendarDays size={16}/>{new Date(request.created_at).toLocaleDateString()}</dd></div><div><dt>Expires</dt><dd><Clock3 size={16}/>{new Date(request.expires_at).toLocaleDateString()}</dd></div></dl>{isOwner && <ClosePartRequest requestId={request.id} status={request.status} />}</article>
      <aside className="request-safety-card"><ShieldCheck size={26}/><h2>Private local request</h2><p>Only the requester and verified APG businesses can view this page. APG does not display the requester’s telephone number or email address.</p><p>Confirm fitment, condition and the business before making a payment.</p></aside>
    </div>

    {signedImages.length > 0 && <section className="request-photo-section"><h2>Photos</h2><div className="request-photo-grid">{signedImages.map((image, index) => image.signedUrl && <a href={image.signedUrl} target="_blank" rel="noreferrer" key={request.image_paths[index]}><Image src={image.signedUrl} alt={`Request photo ${index + 1}`} width={720} height={540} unoptimized /></a>)}</div></section>}

    {isOwner && <section className="request-responses-section"><div className="section-heading-row"><div><h2>Business responses</h2><p>Continue privately with a business when its response looks helpful.</p></div><span>{responses.length} {responses.length === 1 ? "response" : "responses"}</span></div>{responses.length ? <div className="response-list">{responses.map((response) => <article className="business-response-card" key={response.id}><div><span className="verified-business-label"><ShieldCheck size={16}/> Verified APG business</span><h3>{response.shops?.name || "Local business"}</h3><small>{response.shops?.location}</small></div><div className="response-availability"><strong>{response.availability}</strong>{response.price !== null && <b>${Number(response.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>}</div><p>{response.message}</p><ContactRespondingShop shopId={response.shop_id} requestLabel={title}/></article>)}</div> : <div className="empty-state"><h3>No responses yet</h3><p>Verified businesses can respond while this request is active.</p></div>}</section>}

    {verifiedBusiness && !isOwner && <section className="request-responses-section">{ownResponse ? <article className="business-response-card"><span className="verified-business-label"><ShieldCheck size={16}/> Your business responded</span><h2>{ownResponse.availability}</h2>{ownResponse.price !== null && <strong>${Number(ownResponse.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>}<p>{ownResponse.message}</p><small>The requester can now choose to message your APG shop.</small></article> : active ? <BusinessResponseForm requestId={request.id} shopId={shop!.id} userId={user.id}/> : <div className="empty-state"><h3>This request is no longer active</h3><p>Closed and expired requests cannot receive new business responses.</p></div>}</section>}
  </div></main>;
}
