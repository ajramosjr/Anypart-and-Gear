"use server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function setBuildIdeasEnabled(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (user.app_metadata?.role !== "admin") redirect("/account");
  const value = formData.get("enabled");
  if (value !== "true" && value !== "false") redirect("/admin?buildIdeas=error");
  const supabase = await createClient();
  const { data, error } = await supabase.from("build_ideas_settings").update({ enabled: value === "true", updated_at: new Date().toISOString() }).eq("id", "build-ideas").select("enabled").single();
  if (error || !data || data.enabled !== (value === "true")) redirect("/admin?buildIdeas=error");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  redirect("/admin?buildIdeas=saved");
}
