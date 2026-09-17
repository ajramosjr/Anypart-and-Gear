import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user || user.app_metadata?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { slug?: string; previousSlug?: string };
  revalidatePath("/tech-wire");
  revalidatePath("/sitemap.xml");
  if (body.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) revalidatePath(`/tech-wire/${body.slug}`);
  if (body.previousSlug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.previousSlug)) revalidatePath(`/tech-wire/${body.previousSlug}`);
  return NextResponse.json({ revalidated: true });
}
