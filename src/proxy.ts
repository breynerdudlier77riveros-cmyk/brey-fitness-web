import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renombró middleware.ts → proxy.ts (función `proxy`, no
// `middleware`) y fuerza el runtime a Node.js — ver node_modules/next/dist/docs.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/app/:path*"],
};
