"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Chrome condicional: Navbar/Footer de marketing vs. Dashboard/Auth ──────
// BREY v1.1 (Dashboard): /app es una aplicación, no una página — no lleva
// el Navbar ni el Footer del sitio de marketing (su propio shell vive en
// app/app/layout.tsx). Ningún archivo de la landing se tocó para lograr
// esto: layout.tsx raíz solo delega la decisión aquí, un único punto,
// en vez de condicionales repetidos por toda la app.
//
// Backend (auth): las páginas de /login, /signup, /reset-password y
// /update-password tampoco llevan chrome de marketing (tienen su propio
// layout minimalista en app/(auth)/layout.tsx). Esta es una lista de
// prefijos mantenida a mano — limitación conocida, no se resuelve ahora
// moviendo las rutas de marketing a su propio route group porque la
// landing sigue congelada (instrucción explícita del fundador) y eso
// sería un refactor de mucho mayor radio sobre rutas ya shipeadas.
//
// Navbar consulta la sesión del lado del cliente (no aquí, no en
// layout.tsx raíz): probarlo con un fetch server-side aquí convirtió las
// ~35 páginas de marketing de estáticas (○) a dinámicas (ƒ) — leer
// cookies() en el layout raíz fuerza renderizado dinámico en todo el
// árbol de rutas debajo, sin excepción. El costo (un parpadeo breve de
// "Entrar/Crear cuenta" antes de que se resuelva la sesión real en
// componentes que ya se hidrataron) es el trade-off estándar y aceptado
// para un navbar con estado de sesión sobre un sitio mayormente estático.
const SIN_CHROME_MARKETING = ["/app", "/login", "/signup", "/reset-password", "/update-password"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sinChrome = SIN_CHROME_MARKETING.some((p) => pathname?.startsWith(p));

  if (sinChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
