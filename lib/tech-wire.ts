import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { notFound } from "next/navigation";
export const getTechWireState = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tech_wire_settings").select("enabled").eq("id", "tech-wire").maybeSingle();
  return { enabled: !error && data?.enabled === true, available: !error && Boolean(data) };
});
export async function requireTechWireAccess() {
  const { enabled } = await getTechWireState();
  if (!enabled && (await getUser())?.app_metadata?.role !== "admin") notFound();
}
