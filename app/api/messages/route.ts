import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type MessageRequest = {
  body?: unknown;
  conversationId?: unknown;
  listingId?: unknown;
  shopId?: unknown;
};

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again to send a message." }, { status: 401 });

  let payload: MessageRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "The message request was not valid." }, { status: 400 });
  }

  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  if (!body || body.length > 2000) return NextResponse.json({ error: "Enter a message between 1 and 2,000 characters." }, { status: 400 });

  const supabase = await createClient();
  let conversationId = typeof payload.conversationId === "string" ? payload.conversationId : "";

  if (conversationId) {
    const { data, error } = await supabase.from("conversations").select("id").eq("id", conversationId).maybeSingle();
    if (error || !data) return NextResponse.json({ error: "That conversation is unavailable." }, { status: 404 });
  } else {
    const listingId = typeof payload.listingId === "string" ? payload.listingId : "";
    const shopId = typeof payload.shopId === "string" ? payload.shopId : "";
    let sellerId = "";

    if (listingId) {
      const { data, error } = await supabase.from("listings").select("user_id").eq("id", listingId).eq("status", "active").maybeSingle();
      if (error || !data?.user_id) return NextResponse.json({ error: "That listing is unavailable." }, { status: 404 });
      sellerId = data.user_id;
    } else if (shopId) {
      const { data, error } = await supabase.from("shops").select("owner_id").eq("id", shopId).eq("is_active", true).maybeSingle();
      if (error || !data?.owner_id) return NextResponse.json({ error: "That shop is unavailable." }, { status: 404 });
      sellerId = data.owner_id;
    } else {
      return NextResponse.json({ error: "Choose a listing or shop to message." }, { status: 400 });
    }

    if (sellerId === user.id) return NextResponse.json({ error: "You cannot message your own listing or shop." }, { status: 400 });

    let conversationQuery = supabase.from("conversations").select("id").eq("buyer_id", user.id).eq("seller_id", sellerId);
    conversationQuery = listingId ? conversationQuery.eq("listing_id", listingId) : conversationQuery.eq("shop_id", shopId);
    const { data: existing, error: findError } = await conversationQuery.maybeSingle();
    if (findError) {
      console.error("[api/messages] conversation lookup failed", { code: findError.code });
      return NextResponse.json({ error: "The conversation could not be opened." }, { status: 400 });
    }

    conversationId = existing?.id || "";
    if (!conversationId) {
      const { data: created, error: createError } = await supabase
        .from("conversations")
        .insert({ listing_id: listingId || null, shop_id: shopId || null, buyer_id: user.id, seller_id: sellerId })
        .select("id")
        .single();
      if (createError) {
        console.error("[api/messages] conversation creation failed", { code: createError.code });
        return NextResponse.json({ error: "The conversation could not be started. Please refresh and try again." }, { status: 400 });
      }
      conversationId = created.id;
    }
  }

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: user.id, body })
    .select("id")
    .single();
  if (messageError) {
    console.error("[api/messages] message insert failed", { code: messageError.code, conversationId });
    return NextResponse.json({ error: "Your message could not be sent. Please try again." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, messageId: message.id, conversationId });
}
