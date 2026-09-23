import Link from "next/link";
import { redirect } from "next/navigation";
import ApgLogo from "@/components/apg-logo";
import NotificationBell from "@/components/notification-bell";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import NotificationCenter, { type NotificationItem } from "./notification-center";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/notifications");

  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id,notification_type,title,body,link,read_at,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main>
      <header className="simple-header">
        <div className="shell nav-wrap">
          <ApgLogo priority />
          <nav className="account-nav"><Link href="/messages">Messages</Link><Link href="/account">My account</Link><NotificationBell userId={user.id} /></nav>
        </div>
      </header>
      <div className="shell page-shell">
        <div className="page-intro"><span className="kicker">APG updates</span><h1 className="page-title">Notifications</h1><p>Messages, offers, exchanges and reviews appear here.</p></div>
        <NotificationCenter initial={(data || []) as NotificationItem[]} userId={user.id} />
      </div>
    </main>
  );
}
