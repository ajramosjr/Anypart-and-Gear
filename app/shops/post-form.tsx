"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const categories = ["Auto", "Marine", "Motorcycle", "Tools", "Equipment", "Other"];

export default function BusinessPostForm({ shopId, ownerId }: { shopId: string; ownerId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const image = form.get("image") as File | null;
    if (!image || !["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 8 * 1024 * 1024) {
      setMessage("Choose a JPG, PNG or WebP photo up to 8 MB.");
      setBusy(false);
      return;
    }
    const supabase = createClient();
    const extension = image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
    const path = `${ownerId}/${crypto.randomUUID()}.${extension}`;
    const upload = await supabase.storage.from("part-images").upload(path, image, { upsert: false, contentType: image.type });
    if (upload.error) {
      setMessage(upload.error.message);
      setBusy(false);
      return;
    }
    const price = String(form.get("price") || "").trim();
    const expiry = String(form.get("expires") || "").trim();
    const { error } = await supabase.from("business_posts").insert({
      shop_id: shopId,
      owner_id: ownerId,
      category: String(form.get("category")),
      caption: String(form.get("caption") || "").trim(),
      image_url: supabase.storage.from("part-images").getPublicUrl(path).data.publicUrl,
      price: price ? Number(price) : null,
      expires_at: expiry ? new Date(`${expiry}T23:59:59`).toISOString() : null,
    });
    if (error) {
      await supabase.storage.from("part-images").remove([path]);
      setMessage(error.message);
      setBusy(false);
      return;
    }
    window.location.assign(`/shops/${shopId}`);
  }

  return <form onSubmit={submit} className="mt-5 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div><h2 className="text-xl font-black text-[#071a35]">Share what your business has</h2><p className="mt-1 text-sm text-slate-600">One photo and a short note. No inventory spreadsheet needed. You can add a price or end date if it is an offer.</p></div>
    <label className="grid gap-1 text-sm font-bold">Photo<input className="rounded-lg border p-3" type="file" name="image" accept="image/jpeg,image/png,image/webp" required /></label>
    <label className="grid gap-1 text-sm font-bold">Short note<textarea className="min-h-24 rounded-lg border p-3" name="caption" minLength={3} maxLength={500} placeholder="What is available? Include details customers should ask about." required /></label>
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="grid gap-1 text-sm font-bold">Category<select className="rounded-lg border p-3" name="category">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-bold">Price (optional)<input className="rounded-lg border p-3" name="price" type="number" min="0" step="0.01" placeholder="Leave blank to ask" /></label>
      <label className="grid gap-1 text-sm font-bold">End date (optional)<input className="rounded-lg border p-3" name="expires" type="date" min={new Date().toLocaleDateString("en-CA")} /></label>
    </div>
    <div><button className="button" disabled={busy}>{busy ? "Posting…" : "Post to Businesses"}</button>{message && <p role="alert" className="mt-2 text-sm text-red-700">{message}</p>}</div>
  </form>;
}
