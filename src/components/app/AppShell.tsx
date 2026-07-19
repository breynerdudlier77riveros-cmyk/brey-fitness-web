"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// ── Contexto de colapso del sidebar ─────────────────────────────────────────
// AppShell es el único dueño de este estado. sidebar/header llegan como
// elementos YA CONSTRUIDOS desde app/app/layout.tsx (Server) — no se
// renderizan inline aquí — así un toggle de colapso solo re-renderiza lo
// que de verdad depende del contexto (Sidebar), nunca Header, que no lee
// nada de este estado. Persistencia en localStorage: acepta un parpadeo
// breve expandido→colapsado en la primera carga como trade-off razonable
// frente a la complejidad de coordinar esto con el servidor vía cookies.

interface SidebarCollapseState {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarCollapseContext = createContext<SidebarCollapseState | null>(null);

const STORAGE_KEY = "brey-sidebar-collapsed";

export function useSidebarCollapse() {
  const ctx = useContext(SidebarCollapseContext);
  if (!ctx) throw new Error("useSidebarCollapse debe usarse dentro de AppShell");
  return ctx;
}

interface Props {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function AppShell({ sidebar, header, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // localStorage no existe durante el render en servidor — leerlo en el
    // initializer de useState (en vez de aquí) produciría un mismatch de
    // hidratación entre el HTML del servidor y el del cliente. Esta es la
    // única sincronización de arranque con ese sistema externo, una sola
    // vez al montar — no un patrón que se repita ni que dispare renders en
    // cascada.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "1") setCollapsed(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <SidebarCollapseContext.Provider value={{ collapsed, toggle }}>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
        {sidebar}
        <div className="flex-1 min-w-0 flex flex-col">
          {header}
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">{children}</div>
          </main>
        </div>
      </div>
    </SidebarCollapseContext.Provider>
  );
}
