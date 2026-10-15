import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { notFound } from "next/navigation";
export const getBuildIdeasState = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("build_ideas_settings").select("enabled").eq("id", "build-ideas").maybeSingle();
  return { enabled: !error && data?.enabled === true, available: !error && Boolean(data) };
});
export async function requireBuildIdeasAccess() {
  const { enabled } = await getBuildIdeasState();
  if (!enabled && (await getUser())?.app_metadata?.role !== "admin") notFound();
}
