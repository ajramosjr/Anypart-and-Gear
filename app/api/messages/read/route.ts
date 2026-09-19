import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await request.json().catch(() => null) as { conversationId?: unknown } | null;
  const conversationId = typeof payload?.conversationId === "string" ? payload.conversationId : "";
  if (!conversationId) return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
  const supabase = await createClient();
  const { data: conversation } = await supabase.from("conversations").select("id").eq("id", conversationId).maybeSingle();
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  const { error } = await supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("conversation_id", conversationId).neq("sender_id", user.id).is("read_at", null);
  if (error) return NextResponse.json({ error: "Messages could not be marked as read" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
