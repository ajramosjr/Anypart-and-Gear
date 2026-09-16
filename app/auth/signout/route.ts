import { NextResponse } from "next/server";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (hasSupabaseConfig()) { const supabase = await createClient(); await supabase.auth.signOut(); }
  return NextResponse.redirect(new URL("/", request.url));
}

