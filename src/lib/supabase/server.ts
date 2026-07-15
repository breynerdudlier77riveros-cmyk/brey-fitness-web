import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ── Cliente de Supabase para Server Components / Route Handlers / Server
// Actions ─────────────────────────────────────────────────────────────────
// cookies() es 100% asíncrona en Next.js 16 (sin fallback síncrono, a
// diferencia de v14/15) — await obligatorio. El try/catch en setAll no es
// un workaround: llamar a cookieStore.set() desde un Server Component (en
// vez de una Server Action o Route Handler) lanza un error, comportamiento
// documentado de Next — con middleware/proxy refrescando la sesión en cada
// request, ese error es seguro de ignorar aquí.

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component renderizando — el proxy ya refresca la sesión.
          }
        },
      },
    }
  );
}
