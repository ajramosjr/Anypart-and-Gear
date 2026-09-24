"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Shop = { name: string; specialty: string; description: string; location: string; postal_code: string; hours: string; website: string | null; services: string[]; is_verified: boolean };

export default function ShopForm({ userId, shop }: { userId: string; shop: Shop | null }) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const website = String(form.get("website") || "").trim();
    const payload = {
      owner_id: userId,
      name: String(form.get("name") || "").trim(),
      specialty: String(form.get("specialty") || "").trim(),
      description: String(form.get("description") || "").trim(),
      location: String(form.get("location") || "").trim(),
      postal_code: String(form.get("postal_code") || "").trim(),
      hours: String(form.get("hours") || "").trim(),
      website: website || null,
      services: String(form.get("services") || "").split(",").map((item) => item.trim()).filter(Boolean).slice(0, 12),
      is_active: true,
    };
    const supabase = createClient();
    const { error } = await supabase.from("shops").upsert(payload, { onConflict: "owner_id" });
    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }
    window.location.assign("/shops");
  }

  return <form className="listing-form" onSubmit={submit}>
    <div className={`business-verification-note ${shop?.is_verified ? "verified" : ""}`}>
      <strong>{shop?.is_verified ? "APG-verified business" : shop ? "Verification pending" : "Simple, document-free verification"}</strong>
      <p>{shop?.is_verified ? "Your business can view and respond to active Parts Wanted requests." : "No licenses, IDs or business documents are uploaded. APG reviews the public business details you provide before access is approved."}</p>
    </div>
    <div className="form-grid">
      <div className="field"><label htmlFor="name">Business name</label><input id="name" name="name" defaultValue={shop?.name} minLength={2} maxLength={100} required /></div>
      <div className="field"><label htmlFor="specialty">Main specialty</label><input id="specialty" name="specialty" defaultValue={shop?.specialty} placeholder="Trailer parts, marine repair, salvage yard..." minLength={2} maxLength={120} required /></div>
      <div className="field full"><label htmlFor="description">About the business</label><textarea id="description" name="description" defaultValue={shop?.description} minLength={10} maxLength={800} required /></div>
      <div className="field"><label htmlFor="location">City and state</label><input id="location" name="location" defaultValue={shop?.location} placeholder="Bay Shore, NY" maxLength={120} required /></div>
      <div className="field"><label htmlFor="postal_code">ZIP code</label><input id="postal_code" name="postal_code" defaultValue={shop?.postal_code} inputMode="numeric" maxLength={12} required /></div>
      <div className="field"><label htmlFor="hours">Business hours</label><input id="hours" name="hours" defaultValue={shop?.hours || "Mon–Fri 8am–5pm"} maxLength={160} required /></div>
      <div className="field"><label htmlFor="website">Website or public business page</label><input id="website" name="website" type="url" defaultValue={shop?.website || ""} placeholder="https://example.com" maxLength={500} /><small>Recommended. Add your website, Google Business profile or social page so APG can confirm the public information.</small></div>
      <div className="field full"><label htmlFor="services">Services and parts carried</label><input id="services" name="services" defaultValue={shop?.services.join(", ")} placeholder="Used parts, installation, delivery, diagnostics" /><small>Separate each service with a comma.</small></div>
    </div>
    <label className="business-attestation"><input type="checkbox" required /> <span>I confirm that I own this business or am authorized to represent it.</span></label>
    <div className="form-actions"><button className="button" disabled={saving}>{saving ? "Saving..." : shop ? "Update business profile" : "Submit business for review"}</button>{message && <span className="form-message error">{message}</span>}</div>
  </form>;
}
