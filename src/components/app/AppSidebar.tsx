"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bolt, Calendar, TrendingUp, Clock, Menu } from "@/components/brand/icons";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/brand/Drawer";

// ── Navegación del Dashboard (BREY v1.1) ────────────────────────────────────
// Sidebar fija en desktop, top bar + Drawer en mobile — mismo componente
// Drawer que ya usa Navbar.tsx, para no introducir un segundo patrón de
// menú móvil. Objetivo no tiene ítem propio: vive como contexto siempre
// visible dentro de "Hoy", no como una sección a la que se navega.

const navItems = [
  { href: "/app", label: "Hoy", icon: Bolt },
  { href: "/app/calendario", label: "Calendario", icon: Calendar },
  { href: "/app/progreso", label: "Progreso", icon: TrendingUp },
  { href: "/app/historial", label: "Historial", icon: Clock },
] as const;

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              active
                ? "bg-orange-500/[0.08] text-orange-400 border-orange-500/20"
                : "text-white/55 border-transparent hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <span className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-orange-400" />
      <span className="text-sm font-black tracking-[0.10em] uppercase">
        <span className="text-orange-400">Brey</span> <span className="text-white">App</span>
      </span>
    </span>
  );
}

export default function AppSidebar() {
  const pathname = usePathname() ?? "/app";
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex md:w-60 md:flex-shrink-0 md:flex-col md:sticky md:top-0 md:h-screen border-r border-white/[0.06] bg-slate-950/60 px-4 py-6">
        <Link href="/app" className="px-2 mb-8">
          <BrandMark />
        </Link>
        <NavLinks pathname={pathname} />
        <div className="mt-auto pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-[10px]">JD</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Atleta demo</p>
              <p className="text-[10px] text-white/50 truncate">Sistema de Hipertrofia</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-xl">
        <Link href="/app">
          <BrandMark />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="p-2 -mr-2 text-white/60 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
      </header>

      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerContent className="bg-slate-950/95 backdrop-blur-2xl">
          <DrawerTitle className="sr-only">Menú del Dashboard</DrawerTitle>
          <div className="px-4 py-6">
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
