import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { categories } from "@/lib/data";

const conditions = ["New", "Like new", "Good", "Fair"] as const;

function listingValues(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const condition = typeof body.condition === "string" ? body.condition : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const price = Number(body.price);
  const trade = body.trade === true;
  if (title.length < 3 || title.length > 100) return { error: "Title must be between 3 and 100 characters." };
  if (description.length < 10 || description.length > 2500) return { error: "Description must be between 10 and 2,500 characters." };
  if (!categories.some((item) => item.name === category)) return { error: "Choose a valid category." };
  if (!conditions.includes(condition as (typeof conditions)[number])) return { error: "Choose a valid condition." };
  if (location.length < 2 || location.length > 120) return { error: "Enter a valid location." };
  if (!Number.isFinite(price) || price < 0 || price > 100000000) return { error: "Enter a valid price." };
  return { values: { title, description, category, condition, location, price, trade } };
}

async function updateStatus(id: string, status: "active" | "sold" | "removed") {
  const user = await getUser(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await createClient(); const { error } = await supabase.from("listings").update({ status }).eq("id", id).eq("user_id", user.id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (typeof body.status === "string") {
    if (!["active", "sold"].includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    return updateStatus(id, body.status);
  }
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = listingValues(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from("listings").update(parsed.values).eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Listing not found or you do not have permission to edit it." }, { status: 404 });
  return NextResponse.json({ ok: true, id: data.id });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; return updateStatus(id, "removed"); }
