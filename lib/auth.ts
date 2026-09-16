import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function getUser() {
  if (!hasSupabaseConfig()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
