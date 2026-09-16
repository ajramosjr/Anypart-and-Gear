import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ReplyBox from "./reply-box";

type Conversation = { id: string; buyer_id: string; seller_id: string; updated_at: string; listings: { title: string } | null; messages: { id: string; body: string; sender_id: string; created_at: string }[] };

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getUser(); if (!user) redirect("/login?next=/messages");
  const supabase = await createClient(); const { data } = await supabase.from("conversations").select("id,buyer_id,seller_id,updated_at,listings(title),messages(id,body,sender_id,created_at)").or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order("updated_at", { ascending: false });
  const conversations = (data || []) as unknown as Conversation[];
  return <main><header className="simple-header"><div className="shell nav-wrap"><Link href="/" className="brand"><span className="brand-mark">APG</span><span className="brand-copy"><strong>Anypart</strong><small>&amp; Gear</small></span></Link><Link href="/account">My account</Link></div></header><div className="shell page-shell"><div className="page-intro"><span className="kicker">Your inbox</span><h1 className="page-title">Messages</h1><p>Keep conversations focused on the listing. Never share passwords or verification codes.</p></div>{conversations.length ? <div className="conversation-list">{conversations.map((conversation) => { const messages = [...conversation.messages].sort((a,b) => a.created_at.localeCompare(b.created_at)); return <section className="conversation" key={conversation.id}><h2>{conversation.listings?.title || "Listing conversation"}</h2><div className="message-stack">{messages.map((message) => <p className={message.sender_id === user.id ? "message mine" : "message"} key={message.id}>{message.body}<small>{new Date(message.created_at).toLocaleDateString()}</small></p>)}</div><ReplyBox conversationId={conversation.id} userId={user.id} /></section>; })}</div> : <div className="empty-state"><h3>No messages yet</h3><p>Contact a seller from any listing to start a conversation.</p><Link className="button" href="/#listings">Browse listings</Link></div>}</div></main>;
}
