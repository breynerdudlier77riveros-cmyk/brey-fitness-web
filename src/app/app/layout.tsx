import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import Sidebar from "@/components/app/Sidebar";
import Header from "@/components/app/Header";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { getOrCreateProfile } from "@/lib/profile/repository";

// ── Shell del Core Product (App Shell real, no el mockup de v1.1) ──────────
// Deliberadamente SIN Navbar/Footer de marketing (ver SiteChrome.tsx) — esto
// debe sentirse como una aplicación, no como una página. noindex: es una
// herramienta interna, no contenido público.
//
// getUser() (no getSession()) revalida el JWT contra el servidor de Auth de
// Supabase — necesario para una decisión de autorización en servidor. Este
// guard es la segunda capa, no la única: src/proxy.ts ya redirige antes de
// llegar aquí en la mayoría de los casos, pero por el Partial Rendering de
// Next.js este layout NO se re-ejecuta en cada navegación cliente entre
// páginas de /app — solo en la carga inicial. Cada página que lee datos
// reales reverifica sesión cerca de su propia fuente de datos (ver
// src/lib/supabase/user.ts) — este layout no es la barrera de seguridad,
// Row Level Security en Postgres sí lo es.
//
// Sidebar/Header se construyen AQUÍ (Server) y se pasan a AppShell como
// props ya armados, no como JSX inline dentro de AppShell — así el estado
// de colapso del sidebar (que vive en AppShell, un Client Component) solo
// re-renderiza lo que de verdad depende de él (Sidebar), nunca Header, que
// no lee ese contexto. Es la respuesta concreta al pedido de "no renders
// innecesarios".

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard | Brey" },
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getOrCreateProfile(supabase, user.id, {
    email: user.email ?? null,
    nombre: user.email?.split("@")[0] ?? "Atleta",
  });

  const navUser = {
    nombre: profile.nombre ?? "Atleta",
    email: user.email ?? "",
  };

  return (
    <AppShell
      sidebar={<Sidebar nombre={navUser.nombre} email={navUser.email} sistemaActual={profile.sistema_actual} />}
      header={<Header user={navUser} />}
    >
      {children}
    </AppShell>
  );
}
