"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import ShoutOutCard from "@/components/shout-out-card";
import type { ShoutOut } from "@/lib/shout-outs";
import { saveShoutOut } from "./actions";

function SaveButtons({ existing }: { existing: boolean }) {
  const { pending } = useFormStatus();
  return <div className="mt-6 flex flex-wrap gap-3">
    <button name="intent" value="draft" disabled={pending} className="min-h-12 rounded-lg border border-slate-300 px-5 font-bold disabled:opacity-50">{pending ? "Saving…" : "Save draft"}</button>
    <button name="intent" value="published" disabled={pending} className="min-h-12 rounded-lg px-5 font-black disabled:opacity-50" style={{ backgroundColor: "#e6b944", color: "#071a35" }}>Publish shout-out</button>
    {existing && <button name="intent" value="archived" formNoValidate disabled={pending} className="min-h-12 rounded-lg border border-slate-300 px-5 font-bold disabled:opacity-50">Remove from page</button>}
  </div>;
}

export default function ShoutOutEditor({ item }: { item?: ShoutOut }) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [website, setWebsite] = useState(item?.website_url || "");
  const [image, setImage] = useState(item?.image_url || "");
  const [preview, setPreview] = useState(false);
  return <div className="mt-6 grid items-start gap-6 lg:grid-cols-2"><form action={saveShoutOut} className="rounded-xl border border-slate-200 bg-white p-6">
    <h2 className="text-xl font-black">{item ? "Edit shout-out" : "New shout-out"}</h2>
    <input type="hidden" name="id" value={item?.id || ""} />
    <label className="mt-5 block font-bold">Name<input required maxLength={120} name="name" value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal" placeholder="Website, business or person" /></label>
    <label className="mt-5 block font-bold">Why we like them<textarea required maxLength={3000} name="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal" /></label>
    <label className="mt-5 block font-bold">Website link<input required type="url" maxLength={2048} name="website_url" value={website} onChange={e => setWebsite(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal" placeholder="https://…" /></label>
    <label className="mt-5 block font-bold">Logo or photo link — optional<input type="url" maxLength={2048} name="image_url" value={image} onChange={e => setImage(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal" placeholder="https://…" /></label>
    <p className="mt-2 text-sm text-slate-600">Use a logo or photo you've been given approval to share.</p>
    <button type="button" onClick={() => setPreview(!preview)} aria-expanded={preview} aria-controls="shout-out-preview" className="mt-5 min-h-11 font-bold underline">{preview ? "Hide preview" : "Preview shout-out"}</button>
    <SaveButtons existing={Boolean(item)} />
    <p className="mt-4 text-sm text-slate-600">Save draft keeps this private. Removing a shout-out hides it from the public page; you can edit and publish it again.</p>
  </form><div id="shout-out-preview">{preview ? <ShoutOutCard preview item={{ name, description, website_url: website, image_url: image }} /> : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-slate-600">Choose Preview shout-out to see your card before publishing.</div>}</div></div>;
}
