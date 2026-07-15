import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// getUser() es una llamada de red real al servidor de Auth de Supabase (no
// solo lee la cookie). app/app/layout.tsx, app/app/page.tsx, app/app/perfil
// y cada página de (auth) la consultan por su cuenta (cada Server Component
// verifica sesión cerca de su propia fuente de datos, no confía en que un
// padre ya la verificó). Sin cache(), un mismo request dispararía varios
// round trips idénticos — React cache() dedupea automáticamente las
// llamadas dentro del mismo request, sin importar cuántos Server
// Components la llamen.
//
// NO se usa en layout.tsx raíz ni en Navbar.tsx: eso convertiría las ~35
// páginas de marketing de estáticas a dinámicas (leer cookies() en el
// layout raíz fuerza renderizado dinámico en todo el árbol de rutas
// debajo). El Navbar consulta la sesión del lado del cliente en su lugar.
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Forma mínima de usuario para UI (Navbar/UserMenu) — nombre real + email. */
export interface NavUser {
  nombre: string;
  email: string;
}
