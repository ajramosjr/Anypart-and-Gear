"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RemovePost({ postId }: { postId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    if (!window.confirm("Remove this business post?")) return;
    setBusy(true);
    const { error: deleteError } = await createClient().from("business_posts").delete().eq("id", postId);
    if (deleteError) { setError(deleteError.message); setBusy(false); return; }
    window.location.reload();
  }
  return <div><button type="button" onClick={remove} disabled={busy} className="mt-3 text-sm font-semibold text-red-700 underline">{busy ? "Removing…" : "Remove post"}</button>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}</div>;
}
