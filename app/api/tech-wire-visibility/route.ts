import { getTechWireState } from "@/lib/tech-wire";
export const dynamic = "force-dynamic";
export async function GET() {
  const { enabled } = await getTechWireState();
  return Response.json({ enabled }, { headers: { "Cache-Control": "no-store" } });
}
