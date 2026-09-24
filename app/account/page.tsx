import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ManageListing from "./manage-listing";
import NotificationSettings from "./notification-settings";
import PushNotificationSettings from "./push-notification-settings";
import ApgLogo from "@/components/apg-logo";
import NotificationBell from "@/components/notification-bell";

type MyListing = { id: string; title: string; price: number; status: string; created_at: string };
export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const user = await getUser(); if (!user) redirect("/login?next=/account");
  const supabase = await createClient(); const { data } = await supabase.from("listings").select("id,title,price,status,created_at").eq("user_id", user.id).neq("status", "removed").order("created_at", { ascending: false });
  const listings = (data || []) as MyListing[];
  const { data: savedPreferences } = await supabase.from("notification_preferences").select("email_messages,email_transactions,email_reviews").eq("user_id", user.id).maybeSingle();
  const preferences = savedPreferences || { email_messages: true, email_transactions: true, email_reviews: true };
  return <main><header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav">{user.app_metadata?.role==="admin"&&<Link href="/admin">Admin</Link>}<Link href="/parts-wanted">Parts Wanted</Link><Link href="/messages">Messages</Link><NotificationBell userId={user.id}/><a href="/auth/signout">Sign out</a></nav></div></header><div className="shell page-shell"><div className="account-heading"><div><span className="kicker">Seller dashboard</span><h1 className="page-title">My listings</h1><p>Welcome, {user.user_metadata?.full_name || user.email}.</p></div><div className="form-actions"><Link className="button button-secondary" href="/parts-wanted/new">Request a part</Link><Link className="button" href="/sell">Post an item</Link></div></div>{listings.length ? <div className="manage-list">{listings.map((listing) => <div className="manage-row" key={listing.id}><div><Link href={`/listing/${listing.id}`}><strong>{listing.title}</strong></Link><small>${Number(listing.price).toLocaleString()} · {listing.status}</small></div><ManageListing id={listing.id} status={listing.status} /></div>)}</div> : <div className="empty-state"><h3>You have no listings yet</h3><p>Post your first item in a few minutes.</p><Link className="button" href="/sell">Create listing</Link></div>}<PushNotificationSettings/><NotificationSettings userId={user.id} initial={preferences}/></div></main>;
}
