import { NextResponse } from "next/server";
import { getVapidKeys } from "@/lib/push";

export const runtime = "nodejs";

export async function GET() {
  const keys = getVapidKeys();
  if (!keys) return NextResponse.json({ error: "Push notifications are not configured." }, { status: 503 });
  return NextResponse.json({ publicKey: keys.publicKey });
}
