"use server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { safeShoutOutUrl } from "@/lib/shout-outs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveShoutOut(form: FormData) {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin/shout-outs");
  if (user.app_metadata?.role !== "admin") redirect("/account");
  const id = String(form.get("id") || "");
  const validId = !id || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const intent = form.get("intent");
  if (!validId || !["draft", "published", "archived"].includes(String(intent))) redirect("/admin/shout-outs?error=invalid");
  const supabase = await createClient();
  if (intent === "archived") {
    if (!id) redirect("/admin/shout-outs?error=invalid");
    const { data, error } = await supabase.from("shout_outs").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id).select("id").single();
    if (error || !data) redirect("/admin/shout-outs?error=save");
    revalidatePath("/shout-outs"); revalidatePath("/admin/shout-outs");
    redirect("/admin/shout-outs?saved=removed");
  }
  const name = String(form.get("name") || "").trim();
  const description = String(form.get("description") || "").trim();
  const website = safeShoutOutUrl(String(form.get("website_url") || "").trim());
  const rawImage = String(form.get("image_url") || "").trim();
  const image = rawImage ? safeShoutOutUrl(rawImage) : null;
  if (!name || name.length > 120 || !description || description.length > 3000 || !website || website.length > 2048 || (rawImage && (!image || image.length > 2048))) redirect("/admin/shout-outs?error=invalid");
  const values = { name, description, website_url: website, image_url: image, status: String(intent), updated_at: new Date().toISOString() };
  const result = id ? await supabase.from("shout_outs").update(values).eq("id", id).select("id").single() : await supabase.from("shout_outs").insert(values).select("id").single();
  if (result.error || !result.data) redirect("/admin/shout-outs?error=save");
  revalidatePath("/shout-outs"); revalidatePath("/admin/shout-outs");
  redirect("/admin/shout-outs?edit=" + result.data.id + "&saved=" + intent);
}
