"use client";
import { useState } from "react";
import { Ban } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function BlockUser({ userId, otherId, blocked }: { userId: string; otherId: string; blocked: boolean }) {
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function toggle(){setBusy(true);setError("");const supabase=createClient();const result=blocked?await supabase.from("blocks").delete().eq("blocker_id",userId).eq("blocked_id",otherId):await supabase.from("blocks").insert({blocker_id:userId,blocked_id:otherId});if(result.error){setError("Could not update block status.");setBusy(false);return;}window.location.reload();}
  return <div><button className="block-user" type="button" onClick={toggle} disabled={busy}><Ban size={14}/>{blocked?"Unblock":"Block"}</button>{error&&<small className="form-message error">{error}</small>}</div>;
}
