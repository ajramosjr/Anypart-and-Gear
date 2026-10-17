import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jobSchema } from "@/lib/jobs";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).eq("is_active", true).maybeSingle();
  if (!shop) return NextResponse.json({ error: "Register your business profile before posting a job." }, { status: 403 });
  const parsed = jobSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the job details." }, { status: 400 });
  const { data, error } = await supabase.from("jobs").insert({ ...parsed.data, shop_id: shop.id }).select("id").single();
  if (error) return NextResponse.json({ error: "The job could not be saved. Please try again." }, { status: 500 });
  return NextResponse.json({ id: data.id, shopId: shop.id }, { status: 201 });
}
