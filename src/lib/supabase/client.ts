import { createBrowserClient } from "@supabase/ssr";

// ── Cliente de Supabase para Client Components ──────────────────────────────
// Se usa directo desde formularios (login/signup/reset) sin pasar por un
// Route Handler intermedio — signInWithPassword/signUp/etc. ya manejan las
// cookies de sesión por su cuenta desde el navegador.

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
