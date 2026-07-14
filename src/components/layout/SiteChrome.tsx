"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Chrome condicional: Navbar/Footer de marketing vs. Dashboard ───────────
// BREY v1.1 (Dashboard): /app es una aplicación, no una página — no lleva
// el Navbar ni el Footer del sitio de marketing (su propio shell vive en
// app/app/layout.tsx). Ningún archivo de la landing se tocó para lograr
// esto: layout.tsx raíz solo delega la decisión aquí, un único punto,
// en vez de condicionales repetidos por toda la app.

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname?.startsWith("/app");

  if (isApp) {
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
