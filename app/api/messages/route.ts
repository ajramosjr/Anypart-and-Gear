import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type MessageType = "text" | "offer" | "offer_counter" | "offer_accept" | "offer_decline";
type MessageRequest = {
  body?: unknown;
  conversationId?: unknown;
  listingId?: unknown;
  shopId?: unknown;
  messageType?: unknown;
  amount?: unknown;
  relatedMessageId?: unknown;
};

const responseTypes = ["offer_accept", "offer_decline", "offer_counter"] as const;

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again to send a message." }, { status: 401 });

  let payload: MessageRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "The message request was not valid." }, { status: 400 });
  }

  const requestedType = typeof payload.messageType === "string" ? payload.messageType : "text";
  if (!["text", "offer", ...responseTypes].includes(requestedType as MessageType)) {
    return NextResponse.json({ error: "That message type is not supported." }, { status: 400 });
  }
  const messageType = requestedType as MessageType;
  const amount = Number(payload.amount);
  if (["offer", "offer_counter"].includes(messageType) && (!Number.isFinite(amount) || amount <= 0 || amount > 100000000)) {
    return NextResponse.json({ error: "Enter a valid offer amount." }, { status: 400 });
  }

  const supabase = await createClient();
  let conversationId = typeof payload.conversationId === "string" ? payload.conversationId : "";
  let conversation: { id: string; buyer_id: string; seller_id: string; listing_id: string | null; shop_id: string | null } | null = null;

  if (conversationId) {
    const { data, error } = await supabase.from("conversations").select("id,buyer_id,seller_id,listing_id,shop_id").eq("id", conversationId).maybeSingle();
    if (error || !data) return NextResponse.json({ error: "That conversation is unavailable." }, { status: 404 });
    conversation = data;
  } else {
    const listingId = typeof payload.listingId === "string" ? payload.listingId : "";
    const shopId = typeof payload.shopId === "string" ? payload.shopId : "";
    let sellerId = "";

    if (listingId) {
      const { data, error } = await supabase.from("listings").select("user_id,allow_offers").eq("id", listingId).eq("status", "active").maybeSingle();
      if (error || !data?.user_id) return NextResponse.json({ error: "That listing is unavailable." }, { status: 404 });
      if (messageType === "offer" && !data.allow_offers) return NextResponse.json({ error: "This seller is not accepting offers on this listing." }, { status: 400 });
      sellerId = data.user_id;
    } else if (shopId && messageType === "text") {
      const { data, error } = await supabase.from("shops").select("owner_id").eq("id", shopId).eq("is_active", true).maybeSingle();
      if (error || !data?.owner_id) return NextResponse.json({ error: "That shop is unavailable." }, { status: 404 });
      sellerId = data.owner_id;
    } else {
      return NextResponse.json({ error: messageType === "offer" ? "Choose a listing to make an offer." : "Choose a listing or shop to message." }, { status: 400 });
    }

    if (sellerId === user.id) return NextResponse.json({ error: "You cannot contact your own listing or shop." }, { status: 400 });

    let conversationQuery = supabase.from("conversations").select("id,buyer_id,seller_id,listing_id,shop_id").eq("buyer_id", user.id).eq("seller_id", sellerId);
    conversationQuery = listingId ? conversationQuery.eq("listing_id", listingId) : conversationQuery.eq("shop_id", shopId);
    const { data: existing, error: findError } = await conversationQuery.maybeSingle();
    if (findError) return NextResponse.json({ error: "The conversation could not be opened." }, { status: 400 });

    conversation = existing || null;
    conversationId = existing?.id || "";
    if (!conversationId) {
      const { data: created, error: createError } = await supabase
        .from("conversations")
        .insert({ listing_id: listingId || null, shop_id: shopId || null, buyer_id: user.id, seller_id: sellerId })
        .select("id,buyer_id,seller_id,listing_id,shop_id")
        .single();
      if (createError) return NextResponse.json({ error: "The conversation could not be started. Please refresh and try again." }, { status: 400 });
      conversation = created;
      conversationId = created.id;
    }
  }

  if (!conversation) return NextResponse.json({ error: "The conversation is unavailable." }, { status: 404 });

  let body = typeof payload.body === "string" ? payload.body.trim() : "";
  let relatedMessageId: string | null = null;
  let offerAmount: number | null = null;

  if (messageType === "text") {
    if (!body || body.length > 2000) return NextResponse.json({ error: "Enter a message between 1 and 2,000 characters." }, { status: 400 });
  } else if (messageType === "offer") {
    if (!conversation.listing_id || user.id !== conversation.buyer_id) return NextResponse.json({ error: "Only the buyer can make an offer on this listing." }, { status: 403 });
    const { data: listing } = await supabase.from("listings").select("allow_offers,status").eq("id", conversation.listing_id).maybeSingle();
    if (!listing || listing.status !== "active" || !listing.allow_offers) return NextResponse.json({ error: "This listing is not accepting offers." }, { status: 400 });
    offerAmount = Math.round(amount * 100) / 100;
    body = `Offer: $${offerAmount.toFixed(2)}`;
  } else {
    relatedMessageId = typeof payload.relatedMessageId === "string" ? payload.relatedMessageId : "";
    if (!relatedMessageId) return NextResponse.json({ error: "Choose an offer to respond to." }, { status: 400 });
    const { data: related } = await supabase.from("messages").select("id,conversation_id,sender_id,message_type,offer_amount").eq("id", relatedMessageId).eq("conversation_id", conversationId).maybeSingle();
    if (!related || !["offer", "offer_counter"].includes(related.message_type) || related.sender_id === user.id) {
      return NextResponse.json({ error: "That offer cannot be changed." }, { status: 400 });
    }
    const { data: existingResponse } = await supabase.from("messages").select("id").eq("related_message_id", relatedMessageId).in("message_type", responseTypes).limit(1).maybeSingle();
    if (existingResponse) return NextResponse.json({ error: "That offer already has a response." }, { status: 400 });
    const previousAmount = Number(related.offer_amount);
    if (messageType === "offer_counter") {
      if (user.id !== conversation.seller_id || related.message_type !== "offer") return NextResponse.json({ error: "Only the seller can counter the buyer's offer." }, { status: 403 });
      offerAmount = Math.round(amount * 100) / 100;
      body = `Counteroffer: $${offerAmount.toFixed(2)}`;
    } else {
      body = messageType === "offer_accept" ? `Offer accepted at $${previousAmount.toFixed(2)}` : `Offer declined at $${previousAmount.toFixed(2)}`;
    }
  }

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: user.id, body, message_type: messageType, offer_amount: offerAmount, related_message_id: relatedMessageId })
    .select("id")
    .single();
  if (messageError) {
    console.error("[api/messages] message insert failed", { code: messageError.code, conversationId });
    return NextResponse.json({ error: "Your message could not be sent. Please try again." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, messageId: message.id, conversationId });
}
