import Link from "next/link";
import { redirect } from "next/navigation";
import { LockKeyhole, UserRound } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ReplyBox from "./reply-box";
import BlockUser from "./block-user";

type Message = { id: string; body: string; sender_id: string; created_at: string };
type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  shop_id: string | null;
  updated_at: string;
  listings: { title: string } | null;
  shops: { name: string } | null;
  messages: Message[];
};

export default async function MessagesPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/messages");

  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id,buyer_id,seller_id,shop_id,updated_at,listings(title),shops(name),messages(id,body,sender_id,created_at)")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  const conversations = (data || []) as unknown as Conversation[];
  const participantIds = [...new Set(conversations.flatMap((item) => [item.buyer_id, item.seller_id]))];
  const { data: profiles } = participantIds.length
    ? await supabase.from("profiles").select("id,full_name").in("id", participantIds)
    : { data: [] };
  const names = new Map((profiles || []).map((profile) => [profile.id, profile.full_name || "Member"]));
  const { data: blocks } = await supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id);
  const blockedIds = new Set((blocks || []).map((block) => block.blocked_id));

  return (
    <main>
      <header className="simple-header">
        <div className="shell nav-wrap">
          <Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link>
          <Link href="/account">My account</Link>
        </div>
      </header>
      <div className="shell page-shell">
        <div className="page-intro">
          <span className="kicker">Private conversations</span>
          <h1 className="page-title">Messages</h1>
          <p className="privacy-note"><LockKeyhole size={16} /> Other members see your display name only—never your email address or phone number.</p>
        </div>
        {conversations.length ? (
          <div className="conversation-list">
            {conversations.map((conversation) => {
              const otherId = conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id;
              const otherName = names.get(otherId) || "Member";
              const messages = [...conversation.messages].sort((a, b) => a.created_at.localeCompare(b.created_at));
              return (
                <section className="conversation" key={conversation.id}>
                  <div className="conversation-heading">
                    <span className="conversation-avatar"><UserRound size={20} /></span>
                    <div><small>Conversation with</small><h2>{otherName}</h2><p>{conversation.listings?.title || conversation.shops?.name || "Marketplace conversation"}</p></div><BlockUser userId={user.id} otherId={otherId} blocked={blockedIds.has(otherId)}/>
                  </div>
                  <div className="message-stack">
                    {messages.map((message) => {
                      const mine = message.sender_id === user.id;
                      return <div className={mine ? "message mine" : "message"} key={message.id}><b>{mine ? "You" : otherName}</b><p>{message.body}</p><small>{new Date(message.created_at).toLocaleString()}</small></div>;
                    })}
                  </div>
                  {blockedIds.has(otherId)?<p className="blocked-note">You blocked this member. Unblock them to send another message.</p>:<ReplyBox conversationId={conversation.id} userId={user.id} />}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="empty-state"><h3>No messages yet</h3><p>Open a listing and tap Contact seller to start a private conversation.</p><Link className="button" href="/#listings">Browse listings</Link></div>
        )}
      </div>
    </main>
  );
}
