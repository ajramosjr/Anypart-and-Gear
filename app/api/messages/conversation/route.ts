import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  let conversationId: unknown;
  try { ({ conversationId } = await request.json()); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof conversationId !== "string" || !/^[0-9a-f-]{36}$/i.test(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: conversation, error: lookupError } = await supabase.from("conversations")
    .select("id,buyer_id,seller_id").eq("id", conversationId).maybeSingle();
  if (lookupError || !conversation || (conversation.buyer_id !== user.id && conversation.seller_id !== user.id)) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const { error } = await supabase.from("conversation_inbox_state")
    .upsert({ conversation_id: conversation.id, user_id: user.id, hidden_at: new Date().toISOString() }, { onConflict: "conversation_id,user_id" });
  if (error) return NextResponse.json({ error: "Could not remove this conversation. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
