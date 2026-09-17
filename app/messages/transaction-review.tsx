"use client";

import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Transaction = { id: string; buyer_confirmed_at: string | null; seller_confirmed_at: string | null; completed_at: string | null };

export default function TransactionReview({ conversationId, userId, otherId, otherName, role, transaction, reviewed }: {
  conversationId: string; userId: string; otherId: string; otherName: string; role: "buyer" | "seller"; transaction?: Transaction; reviewed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const mine = role === "buyer" ? transaction?.buyer_confirmed_at : transaction?.seller_confirmed_at;
  const theirs = role === "buyer" ? transaction?.seller_confirmed_at : transaction?.buyer_confirmed_at;

  async function confirmExchange() {
    setBusy(true); setMessage("");
    const supabase = createClient();
    const confirmation = role === "buyer" ? { buyer_confirmed_at: new Date().toISOString() } : { seller_confirmed_at: new Date().toISOString() };
    let id = transaction?.id;
    if (!id) {
      const { data, error } = await supabase.from("transactions").insert({ conversation_id: conversationId, ...confirmation }).select("id").single();
      if (error) { setMessage(error.code === "23505" ? "Refresh and try once more." : error.message); setBusy(false); return; }
      id = data.id;
    } else {
      const { error } = await supabase.from("transactions").update(confirmation).eq("id", id);
      if (error) { setMessage(error.message); setBusy(false); return; }
    }
    setMessage("Your confirmation is saved."); setBusy(false); router.refresh();
  }

  async function submitReview() {
    if (!transaction?.id) return;
    setBusy(true); setMessage("");
    const { error } = await createClient().from("reviews").insert({ transaction_id: transaction.id, reviewer_id: userId, reviewee_id: otherId, rating, comment: comment.trim() || null });
    if (error) setMessage(error.message);
    else { setMessage("Verified review posted. Thank you!"); setComment(""); router.refresh(); }
    setBusy(false);
  }

  return <div className="transaction-card">
    <div className="transaction-title"><CheckCircle2 size={18}/><div><strong>Verified exchange</strong><small>Both people must confirm before reviews open.</small></div></div>
    {!mine && <button className="button transaction-button" type="button" disabled={busy} onClick={confirmExchange}>{busy ? "Saving…" : "Mark exchange completed"}</button>}
    {mine && !theirs && <p className="transaction-waiting">You confirmed. Waiting for {otherName}.</p>}
    {transaction?.completed_at && !reviewed && <div className="review-form">
      <label>Rate your experience with {otherName}</label>
      <div className="star-picker" aria-label={`${rating} out of 5 stars`}>{[1,2,3,4,5].map((star)=><button type="button" key={star} aria-label={`${star} stars`} onClick={()=>setRating(star)} className={star<=rating?"active":""}><Star size={23}/></button>)}</div>
      <textarea value={comment} maxLength={800} onChange={(event)=>setComment(event.target.value)} placeholder="Optional: describe communication, accuracy and pickup."/>
      <button className="button transaction-button" type="button" disabled={busy} onClick={submitReview}>{busy?"Posting…":"Post verified review"}</button>
    </div>}
    {transaction?.completed_at && reviewed && <p className="transaction-complete"><CheckCircle2 size={15}/> You submitted a verified review.</p>}
    {message && <p className="form-message" role="status">{message}</p>}
  </div>;
}
