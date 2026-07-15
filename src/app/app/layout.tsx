import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/app/AppSidebar";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";

// ── Shell del Dashboard (BREY v1.1 + backend) ────────────────────────────────
// Deliberadamente SIN Navbar/Footer de marketing (ver SiteChrome.tsx) — esto
// debe sentirse como una aplicación, no como una página. noindex: es una
// herramienta interna, no contenido público.
//
// getUser() (no getSession()) revalida el JWT contra el servidor de Auth de
// Supabase — necesario para una decisión de autorización en servidor. Este
// guard es la segunda capa, no la única: src/proxy.ts ya redirige antes de
// llegar aquí en la mayoría de los casos, pero por el Partial Rendering de
// Next.js este layout NO se re-ejecuta en cada navegación cliente entre
// /app, /app/calendario, etc. — solo en la carga inicial. Es aceptable hoy
// porque esas páginas siguen leyendo mockDashboard.ts (nada sensible que
// proteger todavía); el día que lean datos reales de Supabase, cada una
// debe reverificar sesión cerca de su propia fuente de datos, no asumir
// que este layout ya la cubrió. La barrera de seguridad real siempre es
// Row Level Security en Postgres, no esta verificación.

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard | Brey" },
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  let { data: profile } = await supabase
    .from("profiles")
    .select("nombre, sistema_actual")
    .eq("id", user.id)
    .single();

  // Respaldo defensivo: el perfil normalmente ya existe (trigger en
  // auth.users), pero si por alguna razón no se creó, no dejamos al
  // usuario sin sidebar — lo creamos aquí antes de renderizar.
  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email, nombre: user.email?.split("@")[0] ?? "Atleta" })
      .select("nombre, sistema_actual")
      .single();
    profile = created;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      <AppSidebar
        nombre={profile?.nombre ?? "Atleta"}
        email={user.email ?? ""}
        sistemaActual={profile?.sistema_actual ?? null}
      />
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
