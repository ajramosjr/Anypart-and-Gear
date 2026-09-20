import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole, MessageCircle, UserRound } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";
import ReplyBox from "./reply-box";
import BlockUser from "./block-user";
import TransactionReview from "./transaction-review";
import MessageLive from "./message-live";
import OfferActions from "./offer-actions";

type Message = { id: string; body: string; sender_id: string; created_at: string; read_at: string | null; message_type: "text" | "offer" | "offer_counter" | "offer_accept" | "offer_decline"; offer_amount: number | null; related_message_id: string | null };
type Conversation = {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  shop_id: string | null;
  updated_at: string;
  listings: { title: string } | null;
  shops: { name: string } | null;
  messages: Message[];
};
type Transaction = { id: string; conversation_id: string; buyer_confirmed_at: string | null; seller_confirmed_at: string | null; completed_at: string | null };

function conversationSubject(conversation: Conversation) {
  return conversation.listings?.title || conversation.shops?.name || "APG conversation";
}

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ chat?: string }> }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/messages");

  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id,listing_id,buyer_id,seller_id,shop_id,updated_at,listings(title),shops(name),messages(id,body,sender_id,created_at,read_at,message_type,offer_amount,related_message_id)")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  const conversations = ((data || []) as unknown as Conversation[]).map((conversation) => ({
    ...conversation,
    messages: [...conversation.messages].sort((a, b) => a.created_at.localeCompare(b.created_at)),
  }));
  const participantIds = [...new Set(conversations.flatMap((item) => [item.buyer_id, item.seller_id]))];
  const { data: profiles } = participantIds.length
    ? await supabase.from("profiles").select("id,full_name").in("id", participantIds)
    : { data: [] };
  const names = new Map((profiles || []).map((profile) => [profile.id, profile.full_name || "Member"]));
  const { data: blocks } = await supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id);
  const blockedIds = new Set((blocks || []).map((block) => block.blocked_id));
  const conversationIds = conversations.map((conversation) => conversation.id);
  const { data: transactionRows } = conversationIds.length
    ? await supabase.from("transactions").select("id,conversation_id,buyer_confirmed_at,seller_confirmed_at,completed_at").in("conversation_id", conversationIds)
    : { data: [] };
  const transactions = new Map(((transactionRows || []) as Transaction[]).map((transaction) => [transaction.conversation_id, transaction]));
  const transactionIds = [...transactions.values()].map((transaction) => transaction.id);
  const { data: reviews } = transactionIds.length
    ? await supabase.from("reviews").select("transaction_id").eq("reviewer_id", user.id).in("transaction_id", transactionIds)
    : { data: [] };
  const reviewedTransactions = new Set((reviews || []).map((review) => review.transaction_id));
  const requestedChat = (await searchParams).chat;
  const requestedConversation = conversations.find((conversation) => conversation.id === requestedChat);
  const selected = requestedConversation || conversations[0];
  const mobileChatOpen = Boolean(requestedConversation);

  return (
    <main className="messages-page">
      <header className="simple-header messages-header">
        <div className="shell nav-wrap">
          <ApgLogo priority />
          <Link href="/account" className="messages-account-link">My account</Link>
        </div>
      </header>
      <div className="shell page-shell messages-shell">
        <div className="messages-intro">
          <Link href="/#listings" className="messages-back"><ArrowLeft size={16} /> Marketplace</Link>
          <div><span className="kicker">APG Messages</span><h1 className="page-title">Inbox</h1></div>
          <p className="privacy-note"><LockKeyhole size={17} /><span>Chat using display names. Your phone number and email stay private.</span></p>
        </div>
        {conversations.length && selected ? (
          <div className={`inbox-layout${mobileChatOpen ? " has-chat" : ""}`}>
            <aside className="inbox-sidebar" aria-label="Conversations">
              <div className="inbox-sidebar-title"><strong>Conversations</strong><span>{conversations.length}</span></div>
              <div className="inbox-threads">
                {conversations.map((conversation) => {
                  const otherId = conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id;
                  const otherName = names.get(otherId) || "Member";
                  const last = conversation.messages.at(-1);
                  const unread = conversation.messages.filter((message) => message.sender_id !== user.id && !message.read_at).length;
                  return <Link href={`/messages?chat=${conversation.id}`} className={`inbox-thread${selected.id === conversation.id ? " active" : ""}`} key={conversation.id}>
                    <span className="thread-avatar"><UserRound size={19}/></span>
                    <span className="thread-copy"><span><strong>{otherName}</strong><time>{last ? new Date(last.created_at).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}</time></span><small>{conversationSubject(conversation)}</small><p>{last?.body || "Start the conversation"}</p></span>
                    {unread > 0 && <b className="unread-badge" aria-label={`${unread} unread messages`}>{unread}</b>}
                  </Link>;
                })}
              </div>
            </aside>
            {(() => {
              const otherId = selected.buyer_id === user.id ? selected.seller_id : selected.buyer_id;
              const otherName = names.get(otherId) || "Member";
              const respondedOfferIds = new Set(selected.messages.filter((message) => ["offer_accept", "offer_decline", "offer_counter"].includes(message.message_type) && message.related_message_id).map((message) => message.related_message_id as string));
              return <section className="conversation inbox-chat">
                <MessageLive conversationId={selected.id}/>
                <div className="conversation-heading">
                  <Link href="/messages" className="chat-back" aria-label="Back to conversations"><ArrowLeft size={20}/></Link>
                  <div className="conversation-person"><span className="conversation-avatar"><UserRound size={21}/></span><div><small>APG conversation</small><h2>{otherName}</h2></div></div>
                  <BlockUser userId={user.id} otherId={otherId} blocked={blockedIds.has(otherId)}/>
                </div>
                <div className="conversation-subject"><MessageCircle size={14}/><small>Connected through</small><strong>{conversationSubject(selected)}</strong></div>
                <div className="message-stack">
                  {selected.messages.map((message) => {
                    const mine = message.sender_id === user.id;
                    const isOffer = message.message_type === "offer" || message.message_type === "offer_counter";
                    const canAct = isOffer && !mine && !respondedOfferIds.has(message.id);
                    return <div className={`${mine ? "message mine" : "message"}${isOffer ? " offer-message" : ""}`} key={message.id}><b>{mine ? "You" : otherName}{isOffer ? message.message_type === "offer_counter" ? " · Counteroffer" : " · Offer" : ""}</b>{isOffer && message.offer_amount ? <strong className="offer-amount">${Number(message.offer_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> : <p>{message.body}</p>}<small>{new Date(message.created_at).toLocaleString()}</small>{canAct && message.offer_amount && <OfferActions conversationId={selected.id} messageId={message.id} amount={Number(message.offer_amount)} canCounter={user.id === selected.seller_id && message.message_type === "offer"} />}</div>;
                  })}
                </div>
                {selected.listing_id && (
                  <TransactionReview conversationId={selected.id} userId={user.id} otherId={otherId} otherName={otherName} role={selected.buyer_id === user.id ? "buyer" : "seller"} transaction={transactions.get(selected.id)} reviewed={Boolean(transactions.get(selected.id) && reviewedTransactions.has(transactions.get(selected.id)!.id))}/>
                )}
                {blockedIds.has(otherId)
                  ? <p className="blocked-note">You blocked this member. Unblock them to send another message.</p>
                  : <ReplyBox conversationId={selected.id}/>
                }
              </section>;
            })()}
          </div>
        ) : (
          <div className="empty-state inbox-empty"><MessageCircle size={44}/><h3>Your APG inbox is ready</h3><p>Use Contact seller on a listing to safely begin a conversation. After that, keep chatting here—even if the listing is sold.</p><Link className="button" href="/#listings">Browse listings</Link></div>
        )}
      </div>
    </main>
  );
}
