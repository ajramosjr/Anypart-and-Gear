import "server-only";
import { createClient } from "@/lib/supabase/server";

export const COMMUNITY_URL = "https://anypartandgear.discourse.group/";
export async function getCommunityState() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("community_settings").select("enabled").eq("id", "community").maybeSingle();
  return { enabled: !error && data?.enabled === true, available: !error && Boolean(data) };
}
