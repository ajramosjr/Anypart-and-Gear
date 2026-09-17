"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Preferences = { email_messages: boolean; email_transactions: boolean; email_reviews: boolean };

export default function NotificationSettings({ userId, initial }: { userId: string; initial: Preferences }) {
  const [preferences, setPreferences] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true); setSaved(false);
    const { error } = await createClient().from("notification_preferences").upsert({ user_id: userId, ...preferences }, { onConflict: "user_id" });
    setSaving(false); setSaved(!error);
  }

  return <section className="notification-settings">
    <div className="notification-heading"><BellRing size={20}/><div><h2>Email notifications</h2><p>Choose which private marketplace updates are emailed to you.</p></div></div>
    {([
      ["email_messages", "New private messages"],
      ["email_transactions", "Exchange confirmations"],
      ["email_reviews", "Verified reviews"],
    ] as const).map(([key, label]) => <label className="notification-option" key={key}><span>{label}</span><input type="checkbox" checked={preferences[key]} onChange={(event)=>{setSaved(false);setPreferences({...preferences,[key]:event.target.checked});}}/></label>)}
    <div><button className="button button-small" type="button" onClick={save} disabled={saving}>{saving?"Saving…":"Save email settings"}</button>{saved&&<span className="settings-saved"> Saved</span>}</div>
  </section>;
}
