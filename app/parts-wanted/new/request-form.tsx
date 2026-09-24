"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CircleHelp, Search, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const itemTypes = ["Car or truck", "Motorcycle", "Boat", "Trailer", "Machinery", "RC or hobby", "Tool or equipment", "Other"];

export default function RequestForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [kind, setKind] = useState<"known_part" | "help_identify">("known_part");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const requestId = crypto.randomUUID();
    const files = (form.getAll("images") as File[]).filter((file) => file.size > 0).slice(0, 4);
    const supabase = createClient();
    const imagePaths: string[] = [];

    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
        setMessage("Use JPG, PNG or WebP photos no larger than 10 MB each.");
        setSaving(false);
        return;
      }
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${requestId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("part-request-images").upload(path, file, { upsert: false, contentType: file.type });
      if (error) {
        setMessage("A photo could not be uploaded. Please try again.");
        setSaving(false);
        return;
      }
      imagePaths.push(path);
    }

    const yearValue = String(form.get("vehicle_year") || "").trim();
    const partName = String(form.get("part_name") || "").trim();
    const { error } = await supabase.from("part_requests").insert({
      id: requestId,
      requester_id: userId,
      request_kind: kind,
      item_type: String(form.get("item_type") || ""),
      vehicle_year: yearValue ? Number(yearValue) : null,
      make: String(form.get("make") || "").trim() || null,
      model: String(form.get("model") || "").trim() || null,
      part_name: partName || null,
      description: String(form.get("description") || "").trim(),
      location: String(form.get("location") || "").trim(),
      postal_code: String(form.get("postal_code") || "").trim(),
      search_radius: Number(form.get("search_radius") || 25),
      condition_preference: String(form.get("condition_preference") || "Either"),
      image_paths: imagePaths,
      status: "active",
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }
    router.push(`/parts-wanted/${requestId}`);
    router.refresh();
  }

  return (
    <form className="listing-form" onSubmit={submit}>
      <fieldset className="request-kind-picker">
        <legend>How can businesses help?</legend>
        <label className={kind === "known_part" ? "selected" : ""}>
          <input type="radio" name="request_kind" value="known_part" checked={kind === "known_part"} onChange={() => setKind("known_part")} />
          <Search size={22} /><span><strong>I know the part</strong><small>Tell local businesses exactly what you need.</small></span>
        </label>
        <label className={kind === "help_identify" ? "selected" : ""}>
          <input type="radio" name="request_kind" value="help_identify" checked={kind === "help_identify"} onChange={() => setKind("help_identify")} />
          <CircleHelp size={22} /><span><strong>Help me identify it</strong><small>Add photos and describe what you are seeing.</small></span>
        </label>
      </fieldset>

      <div className="form-grid">
        <div className="field"><label htmlFor="item_type">Vehicle or equipment type</label><select id="item_type" name="item_type" required defaultValue=""><option value="" disabled>Choose a type</option>{itemTypes.map((type) => <option key={type}>{type}</option>)}</select></div>
        <div className="field"><label htmlFor="vehicle_year">Year (if known)</label><input id="vehicle_year" name="vehicle_year" type="number" min="1886" max="2100" inputMode="numeric" placeholder="2008" /></div>
        <div className="field"><label htmlFor="make">Make (if known)</label><input id="make" name="make" maxLength={100} placeholder="Jeep, Bayliner, Load Rite..." /></div>
        <div className="field"><label htmlFor="model">Model (if known)</label><input id="model" name="model" maxLength={100} placeholder="Wrangler, Capri 1952..." /></div>
        <div className="field full"><label htmlFor="part_name">{kind === "known_part" ? "Part needed" : "What do you think it might be? (optional)"}</label><input id="part_name" name="part_name" minLength={kind === "known_part" ? 2 : undefined} maxLength={160} required={kind === "known_part"} placeholder={kind === "known_part" ? "Front passenger-side fender" : "Plastic panel underneath the front bumper"} /></div>
        <div className="field full"><label htmlFor="description">{kind === "known_part" ? "Details" : "Describe the problem"}</label><textarea id="description" name="description" minLength={10} maxLength={2000} required placeholder={kind === "known_part" ? "Include fitment details, color, part number or anything else that may help." : "Describe where it is, what happened, any warning lights, sounds or visible damage."} /></div>
        <div className="field full"><label htmlFor="images"><Camera size={17} /> Photos (optional, up to 4)</label><input id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple /><small>Clear close-ups and one wider photo can help a business identify the part.</small></div>
        <div className="field"><label htmlFor="condition_preference">Condition</label><select id="condition_preference" name="condition_preference" defaultValue="Either"><option>Either</option><option>New</option><option>Used</option></select></div>
        <div className="field"><label htmlFor="search_radius">Search distance</label><select id="search_radius" name="search_radius" defaultValue="25"><option value="10">Within 10 miles</option><option value="25">Within 25 miles</option><option value="50">Within 50 miles</option><option value="100">Within 100 miles</option></select></div>
        <div className="field"><label htmlFor="location">City and state</label><input id="location" name="location" minLength={2} maxLength={120} required placeholder="Seaford, NY" /></div>
        <div className="field"><label htmlFor="postal_code">ZIP code</label><input id="postal_code" name="postal_code" minLength={3} maxLength={12} inputMode="numeric" required placeholder="11783" /></div>
      </div>

      <div className="request-privacy-note"><ShieldCheck size={20} /><p><strong>Your contact information stays private.</strong> Only verified APG businesses can view the request. They respond through APG, and you decide whether to continue the conversation.</p></div>
      <div className="form-actions"><button className="button" disabled={saving}>{saving ? "Posting request..." : "Post Parts Wanted request"}</button>{message && <span className="form-message error">{message}</span>}</div>
    </form>
  );
}
