"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { categories } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

type EditableListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  location: string;
  trade: boolean;
  image_url: string;
  image_urls: string[] | null;
  video_url: string | null;
};

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export default function EditForm({ listing, userId }: { listing: EditableListing; userId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [keptImages, setKeptImages] = useState(() =>
    Array.from(new Set([listing.image_url, ...(listing.image_urls || [])].filter(Boolean))),
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const newImages = (form.getAll("images") as File[]).filter((file) => file.size > 0);
    if (keptImages.length + newImages.length === 0) { setMessage("Keep or add at least one photo."); setLoading(false); return; }
    if (keptImages.length + newImages.length > 6) { setMessage("A listing can have up to 6 photos."); setLoading(false); return; }
    for (const image of newImages) {
      if (image.size > 10 * 1024 * 1024) { setMessage("Each photo must be 10 MB or smaller."); setLoading(false); return; }
      if (!allowedImageTypes.includes(image.type)) { setMessage("Choose JPG, PNG or WebP photos."); setLoading(false); return; }
    }
    const supabase = createClient();
    const uploadedImageUrls: string[] = [];
    for (const image of newImages) {
      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("part-images").upload(path, image, { upsert: false, contentType: image.type });
      if (upload.error) { setMessage(upload.error.message); setLoading(false); return; }
      uploadedImageUrls.push(supabase.storage.from("part-images").getPublicUrl(path).data.publicUrl);
    }
    const imageUrls = [...keptImages, ...uploadedImageUrls];
    const video = form.get("video") as File | null;
    let videoUrl = listing.video_url;
    if (video?.size) {
      if (video.size > 50 * 1024 * 1024) { setMessage("Video must be 50 MB or smaller."); setLoading(false); return; }
      if (!["video/mp4", "video/webm", "video/quicktime"].includes(video.type)) { setMessage("Choose an MP4, WebM or MOV video."); setLoading(false); return; }
      const extension = video.name.split(".").pop()?.toLowerCase() || "mp4";
      const path = `${userId}/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("listing-videos").upload(path, video, { upsert: false, contentType: video.type });
      if (upload.error) { setMessage(upload.error.message); setLoading(false); return; }
      videoUrl = supabase.storage.from("listing-videos").getPublicUrl(path).data.publicUrl;
    }
    const response = await fetch(`/api/listings/${listing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.get("title"), description: form.get("description"), price: Number(form.get("price")), condition: form.get("condition"), category: form.get("category"), location: form.get("location"), trade: form.get("trade") === "on", imageUrls, videoUrl }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || "The listing could not be updated."); setLoading(false); return; }
    window.location.assign(`/listing/${listing.id}`);
  }
  return <form onSubmit={submit}><div className="form-grid">
    <div className="field full"><label htmlFor="title">Listing title</label><input id="title" name="title" defaultValue={listing.title} maxLength={100} required /></div>
    <div className="field"><label htmlFor="category">Category</label><select id="category" name="category" defaultValue={listing.category} required>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></div>
    <div className="field"><label htmlFor="condition">Condition</label><select id="condition" name="condition" defaultValue={listing.condition} required><option>New</option><option>Like new</option><option>Good</option><option>Fair</option></select></div>
    <div className="field"><label htmlFor="price">Price</label><input id="price" name="price" type="number" min="0" max="100000000" step="0.01" defaultValue={listing.price} required /></div>
    <div className="field"><label htmlFor="location">Location</label><input id="location" name="location" defaultValue={listing.location} maxLength={120} required /></div>
    <div className="field full"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={listing.description} minLength={10} maxLength={2500} required /></div>
    <div className="field full"><label htmlFor="images">Listing photos</label><small>Keep, remove or add photos. The first photo is the main photo.</small>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {keptImages.map((src, index) => <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-300 bg-slate-100" key={src}>
          <Image src={src} alt={`Listing photo ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 220px" className="object-cover" />
          {index === 0 && <span className="absolute bottom-2 left-2 rounded bg-slate-950 px-2 py-1 text-xs font-bold text-white">Main photo</span>}
          <button type="button" onClick={() => setKeptImages((images) => images.filter((image) => image !== src))} className="absolute right-2 top-2 rounded-lg bg-white px-2 py-1 text-sm font-bold text-slate-950 shadow">Remove</button>
        </div>)}
      </div>
      <input className="mt-3" id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple />
      <small>{keptImages.length} current photo{keptImages.length === 1 ? "" : "s"}; up to 6 total, 10 MB each.</small>
    </div>
    <div className="field full"><label htmlFor="video">{listing.video_url ? "Replace listing video" : "Add listing video"}</label><input id="video" name="video" type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" /><small>Optional; one MP4, WebM or MOV video up to 50 MB.</small></div>
    <div className="field full checkbox-field"><label><input type="checkbox" name="trade" defaultChecked={listing.trade} /> I will consider a trade</label></div>
  </div><div className="form-actions"><button className="button" disabled={loading}>{loading ? "Saving..." : "Save changes"}</button><Link className="button button-ghost-dark" href={`/listing/${listing.id}`}>Cancel</Link>{message && <span className="form-message error">{message}</span>}</div></form>;
}
