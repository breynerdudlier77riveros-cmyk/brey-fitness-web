"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bolt,
  Flag,
  Calendar,
  TrendingUp,
  Book,
  UserIcon,
  Settings,
  Menu,
  ArrowLeft,
  ArrowRight,
  Scale,
} from "@/components/brand/icons";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/brand/Drawer";
import { signOut } from "@/lib/supabase/actions";
import { iniciales } from "@/lib/utils";
import { useSidebarCollapse } from "@/components/app/AppShell";
import SidebarItem from "@/components/app/SidebarItem";

// ── Navegación principal de /app — reemplaza el AppSidebar.tsx de la v1.1
// del Dashboard mock ────────────────────────────────────────────────────────
// Desktop: fija, colapsable a solo íconos (estado en AppShell/useSidebarCollapse).
// Mobile: top bar + Drawer, siempre expandido (colapsar es un concepto de
// escritorio — en mobile ya se oculta entera detrás del Drawer).
// "Perfil" es ítem de nav principal (antes solo vivía en el bloque de
// usuario) — así queda alcanzable sin depender del menú de la cuenta.

interface Props {
  nombre: string;
  email: string;
  sistemaActual: string | null;
}

const navItems = [
  { href: "/app", label: "Dashboard", icon: Bolt },
  { href: "/app/sistema", label: "Mi Sistema", icon: Flag },
  { href: "/app/entrenamientos", label: "Entrenamientos", icon: Calendar },
  { href: "/app/progreso", label: "Progreso", icon: TrendingUp },
  { href: "/app/biblioteca", label: "Biblioteca", icon: Book },
  { href: "/app/composicion-corporal", label: "Composición Corporal", icon: Scale },
  { href: "/app/perfil", label: "Perfil", icon: UserIcon },
  { href: "/app/configuracion", label: "Configuración", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark() {
  return (
    <span className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
      <span className="text-sm font-black tracking-[0.10em] uppercase">
        <span className="text-orange-400">Brey</span> <span className="text-white">App</span>
      </span>
    </span>
  );
}

function UserBlock({ nombre, email, sistemaActual }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 px-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-[10px]">{iniciales(nombre)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{nombre}</p>
          <p className="text-[10px] text-white/50 truncate">{sistemaActual ?? email}</p>
        </div>
      </div>
      <form action={signOut}>
        <button
          type="submit"
          className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-white/45 hover:text-white/80 hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

export default function Sidebar({ nombre, email, sistemaActual }: Props) {
  const pathname = usePathname() ?? "/app";
  const [open, setOpen] = useState(false);
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <>
      {/* Desktop */}
      <aside
        className={`print:hidden hidden md:flex md:flex-shrink-0 md:flex-col md:sticky md:top-0 md:h-screen border-r border-white/[0.06] bg-slate-950/60 px-3 py-6 transition-[width] duration-200 ${
          collapsed ? "md:w-[4.5rem]" : "md:w-60"
        }`}
      >
        <div className={`flex items-center mb-8 px-1 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link href="/app" className="px-1">
              <BrandMark />
            </Link>
          )}
          <button
            onClick={toggle}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            ) : (
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon }) => (
            <SidebarItem key={href} href={href} label={label} icon={icon} active={isActive(pathname, href)} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/[0.06]">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-[10px]">{iniciales(nombre)}</span>
              </div>
            </div>
          ) : (
            <UserBlock nombre={nombre} email={email} sistemaActual={sistemaActual} />
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="print:hidden md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-xl">
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
          <div className="px-4 py-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
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
            <div className="pt-4 border-t border-white/[0.06]">
              <UserBlock nombre={nombre} email={email} sistemaActual={sistemaActual} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
