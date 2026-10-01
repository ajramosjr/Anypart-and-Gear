import { NextRequest, NextResponse } from "next/server";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const stopWords = new Set(["a", "an", "and", "for", "find", "i", "me", "need", "part", "parts", "please", "search", "show", "the", "to", "want", "with"]);

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "").trim().slice(0, 80);
  const words = [...new Set(query.toLowerCase().match(/[a-z0-9-]+/g) || [])]
    .filter((word) => word.length > 1 && !stopWords.has(word)).slice(0, 5);
  if (!words.length) return NextResponse.json({ error: "Tell Gear a part name, model, or number to search." }, { status: 400 });
  if (!hasSupabaseConfig()) return NextResponse.json({ error: "Search is unavailable right now." }, { status: 503 });

  const supabase = await createClient();
  const filters = words.flatMap((word) => [`title.ilike.%${word}%`, `description.ilike.%${word}%`]);
  const { data, error } = await supabase.from("listings")
    .select("id,title,description,price,location,image_url,created_at")
    .eq("status", "active").or(filters.join(",")).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: "Search is unavailable right now." }, { status: 503 });

  const results = (data || []).map((item) => {
    const title = item.title.toLowerCase();
    const details = (item.description || "").toLowerCase();
    const score = words.reduce((total, word) => total + (title.includes(word) ? 3 : 0) + (details.includes(word) ? 1 : 0), 0);
    return { item, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || b.item.created_at.localeCompare(a.item.created_at))
    .slice(0, 5).map(({ item }) => ({ id: item.id, title: item.title, price: item.price, location: item.location, imageUrl: item.image_url }));
  return NextResponse.json({ results });
}
