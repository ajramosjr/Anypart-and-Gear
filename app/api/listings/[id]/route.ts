import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function updateStatus(id: string, status: "active" | "sold" | "removed") {
  const user = await getUser(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await createClient(); const { error } = await supabase.from("listings").update({ status }).eq("id", id).eq("user_id", user.id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; const body = await request.json(); if (!['active','sold'].includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 }); return updateStatus(id, body.status); }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; return updateStatus(id, "removed"); }

