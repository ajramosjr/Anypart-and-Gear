import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) { return updateSession(request); }
// The standalone educational guides contains no account data.
export const config = { matcher: ["/((?!(?:engine-preview|how-things-work)\\.html$|_next/static|_next/image|favicon.ico|APG\\.vcf$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
