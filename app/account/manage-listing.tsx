"use client";
import Link from "next/link";
import { useState } from "react";
export default function ManageListing({ id, status }: { id: string; status: string }) {
  const [busy, setBusy] = useState(false);
  async function update(action: "sold" | "active" | "remove") {
    if (action === "sold" && !window.confirm("Mark this listing as sold? It will be hidden from the marketplace, but you can restore it later.")) return;
    if (action === "remove" && !window.confirm("Remove this listing? It will be hidden from the marketplace.")) return;
    setBusy(true);
    const response = await fetch(`/api/listings/${id}`, { method: action === "remove" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: action === "remove" ? undefined : JSON.stringify({ status: action }) });
    if (response.ok) window.location.reload(); else setBusy(false);
  }
  return <div className="manage-actions"><Link href={`/listing/${id}/edit`}>Edit</Link><button disabled={busy} onClick={() => update(status === "sold" ? "active" : "sold")}>{status === "sold" ? "Mark active" : "Mark sold"}</button><button className="danger" disabled={busy} onClick={() => update("remove")}>Remove</button></div>;
}
