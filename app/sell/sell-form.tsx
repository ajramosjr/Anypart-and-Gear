"use client";

import { FormEvent, useState } from "react";
import { categories } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

export default function SellForm({ userId, sellerName }: { userId: string; sellerName: string }) {
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const form = new FormData(event.currentTarget); const images = form.getAll("images") as File[];
    const supabase = createClient(); const imageUrls: string[] = [];
    for (const image of images.filter((file) => file.size).slice(0, 6)) {
      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("part-images").upload(path, image, { upsert: false });
      if (upload.error) { setMessage(upload.error.message); setLoading(false); return; }
      imageUrls.push(supabase.storage.from("part-images").getPublicUrl(path).data.publicUrl);
    }
    const { data, error } = await supabase.from("listings").insert({
      user_id: userId, seller_name: sellerName, title: form.get("title"), description: form.get("description"), price: Number(form.get("price")), condition: form.get("condition"), category: form.get("category"), location: form.get("location"), image_url: imageUrls[0], image_urls: imageUrls, trade: form.get("trade") === "on", status: "active"
    }).select("id").single();
    if (error) setMessage(error.message); else window.location.assign(`/listing/${data.id}`);
    setLoading(false);
  }
  return <form onSubmit={submit}><div className="form-grid">
    <div className="field full"><label htmlFor="title">Listing title</label><input id="title" name="title" maxLength={100} required placeholder="What are you selling?" /></div>
    <div className="field"><label htmlFor="category">Category</label><select id="category" name="category" required defaultValue=""><option value="" disabled>Choose a category</option>{categories.map((c) => <option key={c.name}>{c.name}</option>)}</select></div>
    <div className="field"><label htmlFor="condition">Condition</label><select id="condition" name="condition" required><option>New</option><option>Like new</option><option>Good</option><option>Fair</option></select></div>
    <div className="field"><label htmlFor="price">Price</label><input id="price" name="price" type="number" min="0" step="0.01" required placeholder="0.00" /></div>
    <div className="field"><label htmlFor="location">Location</label><input id="location" name="location" required placeholder="City, State" /></div>
    <div className="field full"><label htmlFor="description">Description</label><textarea id="description" name="description" required maxLength={2500} placeholder="Include measurements, fitment details, known issues and pickup information." /></div>
    <div className="field full"><label htmlFor="images">Photos (up to 6)</label><input id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple required /></div>
    <div className="field full checkbox-field"><label><input type="checkbox" name="trade" /> I will consider a trade</label></div>
  </div><div className="form-actions"><button className="button" disabled={loading}>{loading ? "Publishing..." : "Publish listing"}</button>{message && <span className="form-message error">{message}</span>}</div></form>;
}
