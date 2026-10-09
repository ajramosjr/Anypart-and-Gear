"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Shop = { name: string; specialty: string; description: string; location: string; postal_code: string; hours: string; website: string | null; services: string[]; is_verified: boolean };

const BUSINESS_TYPES = [
  "Auto Repair / Mechanic Shop",
  "Auto Parts Store",
  "Machine Shop",
  "Transmission Shop",
  "Hose & Hydraulic Shop",
  "Junkyard / Salvage Yard",
  "Motorcycle Parts & Repair Shop",
  "Marine Parts / Boat Repair Shop",
  "Trailer Parts, Dealer & Repair Shop",
  "RV Parts, Dealer & Repair Shop",
  "Truck Parts & Repair Shop",
  "Bus Parts & Repair Shop",
  "Heavy Equipment Parts & Repair",
  "Tool & Workwear Supplier",
  "Other Parts-Related Business",
];

export default function ShopForm({ userId, shop, directoryBusiness }: { userId: string; shop: Shop | null; directoryBusiness?: { name: string; address: string; postal_code: string; website: string; detail: string; directoryGroup: string } }) {
  const defaults = shop || (directoryBusiness ? { name: directoryBusiness.name, location: directoryBusiness.address, postal_code: directoryBusiness.postal_code, website: directoryBusiness.website, description: directoryBusiness.detail, specialty: directoryBusiness.directoryGroup, hours: "Contact for hours", services: [] } : null);
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
    const { data, error } = await supabase.from("shops").upsert(payload, { onConflict: "owner_id" }).select("id").single();
    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }
    if (!shop?.is_verified) {
      await fetch("/api/business-activation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shopId: data.id, action: "request" }) }).catch(() => null);
    }
    window.location.assign("/shops/register?submitted=1");
  }

  return <form className="listing-form" onSubmit={submit}>
    <div className={`business-verification-note ${shop?.is_verified ? "verified" : ""}`}>
      <strong>{shop?.is_verified ? "APG Messages enabled" : shop ? "Activation pending" : "Activate APG Messages"}</strong>
      <p>{shop?.is_verified ? "Your business can view and respond to active Parts Wanted requests." : "Submit a business activation request. An administrator will confirm that you represent this business before enabling parts requests and APG Messages. No licenses or identity documents are uploaded."}</p>
    </div>
    <div className="form-grid">
      <div className="field"><label htmlFor="name">Business name</label><input id="name" name="name" defaultValue={defaults?.name} minLength={2} maxLength={100} required /></div>
      <div className="field"><label htmlFor="specialty">What type of parts store or shop are you?</label><select id="specialty" name="specialty" defaultValue={defaults?.specialty || ""} required><option value="" disabled>Choose your store or shop type</option>{defaults?.specialty && !BUSINESS_TYPES.includes(defaults.specialty) && <option value={defaults.specialty}>{defaults.specialty}</option>}{BUSINESS_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select><small>This specialty appears on your APG business card and shop page.</small></div>
      <div className="field full"><label htmlFor="description">About the business</label><textarea id="description" name="description" defaultValue={defaults?.description} minLength={10} maxLength={800} required /></div>
      <div className="field"><label htmlFor="location">City and state</label><input id="location" name="location" defaultValue={defaults?.location} placeholder="Bay Shore, NY" maxLength={120} required /></div>
      <div className="field"><label htmlFor="postal_code">ZIP code</label><input id="postal_code" name="postal_code" defaultValue={defaults?.postal_code} inputMode="numeric" maxLength={12} required /></div>
      <div className="field"><label htmlFor="hours">Business hours</label><input id="hours" name="hours" defaultValue={defaults?.hours || "Mon–Fri 8am–5pm"} maxLength={160} required /></div>
      <div className="field"><label htmlFor="website">Website or public business page</label><input id="website" name="website" type="url" defaultValue={defaults?.website || ""} placeholder="https://example.com" maxLength={500} /><small>Recommended. Add your website, Google Business profile or social page so APG can confirm the public information.</small></div>
      <div className="field full"><label htmlFor="services">Services and parts carried</label><input id="services" name="services" defaultValue={defaults?.services.join(", ")} placeholder="Used parts, installation, delivery, diagnostics" /><small>Separate each service with a comma.</small></div>
    </div>
    <p className="mb-4 text-sm text-slate-600">Activation confirms account access; it is not an APG endorsement or guarantee of products or services. Manage email and phone alert preferences in <Link href="/account" className="underline">My Account</Link>. Read our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
    <label className="business-attestation"><input type="checkbox" required /> <span>I confirm that I own this business or am authorized to represent it.</span></label>
    <div className="form-actions"><button className="button" disabled={saving}>{saving ? "Saving..." : shop?.is_verified ? "Update business profile" : "Submit activation request"}</button>{message && <span className="form-message error">{message}</span>}</div>
  </form>;
}
