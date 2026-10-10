"use server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function setCommunityEnabled(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (user.app_metadata?.role !== "admin") redirect("/account");
  const value = formData.get("enabled");
  if (value !== "true" && value !== "false") redirect("/admin?community=error");
  const supabase = await createClient();
  const { data, error } = await supabase.from("community_settings").update({
    enabled: value === "true", updated_at: new Date().toISOString(),
  }).eq("id", "community").select("enabled").single();
  if (error || !data || data.enabled !== (value === "true")) redirect("/admin?community=error");
  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/admin");
  redirect("/admin?community=saved");
}
