"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Close, Menu } from "@/components/brand/icons";
import Button from "@/components/brand/Button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/brand/Drawer";
import UserMenu from "@/components/layout/UserMenu";
import { iniciales } from "@/lib/utils";
import { signOut } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import type { NavUser } from "@/lib/supabase/user";

const navLinks = [
  { href: "/bps", label: "El Método" },
  { href: "/Sistemas", label: "Sistemas" },
  { href: "/ejercicios", label: "Ejercicios" },
  { href: "/blog", label: "Blog" },
  { href: "/calculadoras", label: "Calculadoras" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const pathname = usePathname();

  // Sesión consultada del lado del cliente a propósito — ver comentario en
  // SiteChrome.tsx (leerla server-side en el layout raíz forzaría renderizado
  // dinámico en las ~35 páginas de marketing, hoy estáticas). onAuthStateChange
  // mantiene el estado al día sin recargar: login/logout se reflejan al
  // instante, no solo en la próxima carga completa de página.
  useEffect(() => {
    const supabase = createClient();

    async function cargarUsuario(authUser: { id: string; email?: string } | null) {
      if (!authUser) {
        setUser(null);
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("nombre").eq("id", authUser.id).single();
      setUser({
        nombre: profile?.nombre ?? authUser.email?.split("@")[0] ?? "Atleta",
        email: authUser.email ?? "",
      });
    }

    supabase.auth.getUser().then(({ data }) => cargarUsuario(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      cargarUsuario(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/75 backdrop-blur-2xl">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-black tracking-[0.10em] uppercase whitespace-nowrap flex-shrink-0"
          onClick={() => setOpen(false)}
        >
          <span className="text-orange-400">Brey</span>
          <span className="text-white"> Fitness</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition-colors duration-200 ${
                    active ? "text-white" : "text-white/60 hover:text-white/80"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop: sesión */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
                Entrar
              </Link>
              <Button href="/signup" size="sm" className="tracking-wide">
                Crear cuenta
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-white/60 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? (
            <Close className="w-5 h-5" strokeWidth={2} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={2} />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerContent className="bg-slate-950/95 backdrop-blur-2xl">
          <DrawerTitle className="sr-only">Menú de navegación</DrawerTitle>
          <div className="px-4 py-6 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    active
                      ? "text-white bg-white/[0.06]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {user ? (
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-[10px]">{iniciales(user.nombre)}</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{user.nombre}</p>
                </div>
                <Link
                  href="/app/perfil"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                >
                  Mi Perfil
                </Link>
                <Link
                  href="/app"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                >
                  Dashboard
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Button href="/signup" size="md" onClick={() => setOpen(false)} className="w-full">
                  Crear cuenta
                </Button>
                <Button href="/login" variant="outline" size="md" onClick={() => setOpen(false)} className="w-full">
                  Entrar
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
