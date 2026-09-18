"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { categories } from "@/lib/data";

type EditableListing = { id: string; title: string; description: string; price: number; condition: string; category: string; location: string; trade: boolean };

export default function EditForm({ listing }: { listing: EditableListing }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/listings/${listing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.get("title"), description: form.get("description"), price: Number(form.get("price")), condition: form.get("condition"), category: form.get("category"), location: form.get("location"), trade: form.get("trade") === "on" }) });
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
    <div className="field full checkbox-field"><label><input type="checkbox" name="trade" defaultChecked={listing.trade} /> I will consider a trade</label></div>
  </div><div className="form-actions"><button className="button" disabled={loading}>{loading ? "Saving..." : "Save changes"}</button><Link className="button button-ghost-dark" href={`/listing/${listing.id}`}>Cancel</Link>{message && <span className="form-message error">{message}</span>}</div></form>;
}
