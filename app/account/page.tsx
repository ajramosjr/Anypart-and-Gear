import "@/app/home-feed.css";
import { Home, Package, Store, BookOpen, MessageCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ManageListing from "./manage-listing";
import NotificationSettings from "./notification-settings";
import PushNotificationSettings from "./push-notification-settings";
import ApgLogo from "@/components/apg-logo";


type MyListing = { id: string; title: string; price: number; status: string; created_at: string };
export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const user = await getUser(); if (!user) redirect("/login?next=/account");
  const supabase = await createClient(); const { data } = await supabase.from("listings").select("id,title,price,status,created_at").eq("user_id", user.id).neq("status", "removed").order("created_at", { ascending: false });
  const listings = (data || []) as MyListing[];
  const isOwnerAdmin = user.id === "5dd24cb6-6706-4c4e-8c17-0b03b2632acb" && user.app_metadata?.role === "admin";
  const { data: savedPreferences } = await supabase.from("notification_preferences").select("email_messages,email_transactions,email_reviews").eq("user_id", user.id).maybeSingle();
  const { data: business } = await supabase.from("shops").select("id,name").eq("owner_id", user.id).eq("is_active", true).eq("is_verified", true).maybeSingle();
  const preferences = savedPreferences || { email_messages: true, email_transactions: true, email_reviews: true };
  return <main className="live-feed apg-modern-account"><header className="lf-header"><div className="lf-header-inner"><ApgLogo priority/><div style={{flex:1}}/><Link className="lf-icon-button" aria-label="Messages" href="/messages"><MessageCircle size={23}/></Link><Link className="lf-account" aria-label="My account" href="/account"><UserRound size={20}/></Link></div></header><div className="ma-shell"><div className="account-heading"><div><span className="ma-kicker">YOUR ACCOUNT</span><h1 className="page-title">My listings</h1><p>Welcome, {user.user_metadata?.full_name || user.email}.</p></div><div className="form-actions">{isOwnerAdmin && <Link className="button" href="/admin">Admin Dashboard</Link>}<Link className="button button-secondary" href="/parts-wanted/new">Request a part</Link><Link className="button ma-primary" href="/sell">Post an Item</Link></div></div>{listings.length ? <div className="manage-list">{listings.map((listing) => <div className="manage-row" key={listing.id}><div><Link href={`/listing/${listing.id}`}><strong>{listing.title}</strong></Link><small>${Number(listing.price).toLocaleString()} · {listing.status}</small></div><ManageListing id={listing.id} status={listing.status} /></div>)}</div> : <div className="empty-state"><h3>You have no listings yet</h3><p>Post your first item in a few minutes.</p><Link className="button" href="/sell">Create listing</Link></div>}{business && <section className="my-8 rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">Hiring at {business.name}</h2><div className="mt-4 flex flex-wrap gap-3"><Link className="button" href="/jobs/new">Post a Job</Link><Link className="button button-secondary" href={`/shops/${business.id}?tab=jobs`}>Manage Job Openings</Link></div></section>}<PushNotificationSettings/><NotificationSettings userId={user.id} initial={preferences}/><div className="ma-account-links"><Link href="/notifications">View notifications</Link><Link href="/parts-wanted">Parts Wanted</Link><a href="/auth/signout">Sign out</a></div></div>
<nav className="lf-bottom-nav" aria-label="Quick navigation"><Link href="/"><Home size={20}/>Home</Link><Link href="/#parts"><Package size={20}/>Parts</Link><Link href="/#directory"><Store size={20}/>Directory</Link><Link href="/#resources"><BookOpen size={20}/>Learn</Link><Link href="/account" className="lf-current" aria-current="page"><UserRound size={20}/>Account</Link></nav>
<style>{`
.apg-modern-account{padding-bottom:105px}
.apg-modern-account .lf-header{display:block!important}
.apg-modern-account .ma-shell{max-width:960px;margin:auto;padding:28px 24px}
.apg-modern-account .ma-kicker{font-size:11px;font-weight:700;letter-spacing:1.4px;color:#8a681b}
.apg-modern-account .page-title{font-family:Arial,Helvetica,sans-serif!important;font-size:30px!important;line-height:1.2;letter-spacing:-.7px;text-transform:none;margin:10px 0}
.apg-modern-account .account-heading{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px}
.apg-modern-account .account-heading p{font-size:15px;color:#10233c;margin:0}
.apg-modern-account .form-actions{display:flex;flex-wrap:wrap;gap:8px}
.apg-modern-account.apg-modern-account.apg-modern-account :is(.button,.manage-actions a,.manage-actions button){display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:43px;border:1px solid #dce2ea!important;background:white!important;color:#10233c!important;border-radius:10px!important;box-shadow:none!important;padding:10px 14px!important;font:600 14px Arial,Helvetica,sans-serif!important;text-transform:none;letter-spacing:0}
.apg-modern-account.apg-modern-account.apg-modern-account .ma-primary{background:#e6b944!important;border-color:#cda137!important}
.apg-modern-account.apg-modern-account.apg-modern-account .manage-actions .danger{color:#a12b32!important}
.apg-modern-account .manage-list{display:grid;gap:14px}
.apg-modern-account .manage-row{display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap;padding:22px;border:1px solid #e1e7ef;border-radius:18px;background:white;box-shadow:0 4px 20px #10233c04}
.apg-modern-account .manage-row strong{font-size:17px}
.apg-modern-account .manage-row small{display:block;font-size:14px;color:#10233c;margin-top:9px}
.apg-modern-account .manage-actions{display:flex;flex-wrap:wrap;gap:8px}
.apg-modern-account .notification-settings{padding:22px;background:white;border:1px solid #e1e7ef;border-radius:18px;margin-top:20px}
.apg-modern-account .notification-heading{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px}
.apg-modern-account .notification-heading svg{flex-shrink:0;margin-top:3px}
.apg-modern-account .notification-heading h2{font:700 18px Arial,Helvetica,sans-serif;margin:0 0 8px}
.apg-modern-account .notification-heading p{font-size:14px;color:#10233c;line-height:1.65;margin:0}
.apg-modern-account .notification-option{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:17px 0;border-top:1px solid #e1e7ef;font-size:14px}
.apg-modern-account input[type=checkbox]{width:20px;height:20px;accent-color:#10233c;flex-shrink:0}
.apg-modern-account .ma-account-links{display:flex;flex-wrap:wrap;gap:20px;font-size:14px;margin-top:24px}
.apg-modern-account.apg-modern-account.apg-modern-account .lf-bottom-nav a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;position:relative;flex:1;padding:9px 0;background:transparent!important;color:#10233c!important;border:0!important;border-radius:0!important;box-shadow:none!important}
.apg-modern-account .lf-bottom-nav a.lf-current::after{content:"";position:absolute;bottom:2px;left:30%;right:30%;height:3px;border-radius:4px;background:#e6b944}

.apg-modern-account.apg-modern-account .account-heading{align-items:flex-start!important;text-align:left!important;justify-content:space-between!important}
.apg-modern-account.apg-modern-account .account-heading>div:first-child{width:100%;margin:0!important;text-align:left!important;align-self:flex-start!important}
.apg-modern-account.apg-modern-account .account-heading .page-title,.apg-modern-account.apg-modern-account .account-heading p{text-align:left!important}
.apg-modern-account.apg-modern-account .account-heading .form-actions{width:100%;justify-content:flex-start!important;margin-top:0!important}
.apg-modern-account.apg-modern-account.apg-modern-account .account-heading .form-actions a.button{background:#e6b944!important;border-color:#cda137!important;color:#10233c!important;cursor:pointer}
.apg-modern-account.apg-modern-account.apg-modern-account .account-heading .form-actions a.button:hover{background:#f1c85e!important}
@media(max-width:800px){.apg-modern-account .ma-shell{padding:24px 14px}.apg-modern-account .lf-bottom-nav{display:flex!important}.apg-modern-account .manage-row,.apg-modern-account .notification-settings{padding:20px}.apg-modern-account .page-title{font-size:28px!important}}
`}</style></main>;
}
