import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ── Refresco de sesión para src/proxy.ts (Next.js 16 renombró
// middleware.ts → proxy.ts, forzado a runtime Node.js) ──────────────────────
// Esta capa NO es la protección real de las rutas — es la barrera rápida
// para una buena UX (redirect limpio en vez de una página server-rendered
// con datos vacíos) y el único lugar donde el token refrescado se puede
// persistir de vuelta al navegador antes de que la respuesta salga. La
// barrera de seguridad real es Row Level Security en Postgres; cada ruta
// protegida además revalida la sesión por su cuenta (ver app/app/layout.tsx)
// — los docs de Next.js advierten explícitamente no confiar solo en esta capa.

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() revalida el JWT contra el servidor de Auth — no basta con leer
  // la cookie (getSession()) para una decisión de redirect.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/app")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
