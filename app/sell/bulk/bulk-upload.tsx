"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { suggestListingCategory } from "@/lib/category-check";

const MAX_ACTIVE_LISTINGS = 100;

function parseLine(line: string) {
  const cells: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      value += '"';
      i++;
    } else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      cells.push(value.trim());
      value = "";
    } else value += char;
  }
  cells.push(value.trim());
  return cells;
}

export default function BulkUpload({
  userId,
  sellerName,
  shopId,
  initialActiveCount,
}: {
  userId: string;
  sellerName: string;
  shopId: string | null;
  initialActiveCount: number;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCount, setActiveCount] = useState(initialActiveCount);
  const remaining = Math.max(0, MAX_ACTIVE_LISTINGS - activeCount);

  async function upload(file: File) {
    setLoading(true);
    setMessage("");

    const lines = (await file.text()).split(/\r?\n/).filter(Boolean);
    const headers = parseLine(lines.shift() || "").map((header) => header.toLowerCase());
    const required = ["title", "description", "price", "condition", "category", "location", "image_url"];

    if (!required.every((header) => headers.includes(header))) {
      setMessage(`Missing required columns: ${required.filter((header) => !headers.includes(header)).join(", ")}`);
      setLoading(false);
      return;
    }

    if (lines.length === 0) {
      setMessage("This CSV does not contain any inventory rows.");
      setLoading(false);
      return;
    }

    if (lines.length > MAX_ACTIVE_LISTINGS) {
      setMessage("A CSV can contain no more than 100 inventory rows.");
      setLoading(false);
      return;
    }

    if (lines.length > remaining) {
      setMessage(`You have ${remaining} listing spaces remaining. Remove ${lines.length - remaining} row(s) from this file, or mark existing listings sold or removed.`);
      setLoading(false);
      return;
    }

    const rows = lines.map((line) => {
      const values = parseLine(line);
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
      return {
        user_id: userId,
        shop_id: shopId,
        seller_name: sellerName,
        title: row.title,
        description: row.description,
        price: Number(row.price),
        condition: row.condition,
        category: row.category,
        location: row.location,
        image_url: row.image_url,
        image_urls: [row.image_url],
        trade: ["true", "yes", "1"].includes(row.trade.toLowerCase()),
        status: "active",
      };
    });

    const mismatches = rows.map((row, index) => ({
      row: index + 2,
      selected: row.category,
      suggested: suggestListingCategory(row.title, row.description, row.category),
    })).filter((item) => item.suggested);

    if (mismatches.length) {
      const examples = mismatches.slice(0, 5).map((item) => `Row ${item.row}: ${item.selected} → ${item.suggested}`).join("; ");
      setMessage(`APG found ${mismatches.length} possible category ${mismatches.length === 1 ? "mistake" : "mistakes"}. Please review the CSV before uploading. ${examples}${mismatches.length > 5 ? "; and more" : ""}.`);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("listings").insert(rows);
    if (error) {
      setMessage(error.message);
    } else {
      setActiveCount((count) => count + rows.length);
      setMessage(`${rows.length} listings uploaded successfully.`);
    }
    setLoading(false);
  }

  return (
    <div className="bulk-upload">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>{activeCount} of {MAX_ACTIVE_LISTINGS} active listings used.</strong>
        <span className="block">{remaining} spaces remaining. Sold and removed listings do not count toward the limit.</span>
      </div>
      <label className="upload-zone">
        <strong>{loading ? "Uploading inventory..." : remaining ? "Choose a CSV file" : "Active listing limit reached"}</strong>
        <span>Maximum 100 rows per file and 100 active listings per account</span>
        <input
          type="file"
          accept=".csv,text/csv"
          disabled={loading || remaining === 0}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
            event.currentTarget.value = "";
          }}
        />
      </label>
      {message && <p className={message.includes("successfully") ? "form-message success" : "form-message error"}>{message}</p>}
      <a className="inline-link" download="anypart-gear-template.csv" href="data:text/csv;charset=utf-8,title%2Cdescription%2Cprice%2Ccondition%2Ccategory%2Clocation%2Cimage_url%2Ctrade%0AExample%20part%2CAdd%20at%20least%2010%20characters%2C100%2CGood%2CCar%20Parts%2CBay%20Shore%2Chttps%3A%2F%2Fexample.com%2Fphoto.jpg%2Cfalse">Download CSV template</a>
    </div>
  );
}
