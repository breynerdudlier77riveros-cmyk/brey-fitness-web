"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Close, Menu } from "@/components/brand/icons";
import Button from "@/components/brand/Button";
import Wordmark from "@/components/brand/Wordmark";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/brand/Drawer";
import UserMenu from "@/components/layout/UserMenu";
import { cn, iniciales } from "@/lib/utils";
import { signOut } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import type { NavUser } from "@/lib/supabase/user";

const navLinks = [
  { href: "/bps", label: "El Método" },
  { href: "/sistemas", label: "Sistemas" },
  { href: "/ejercicios", label: "Ejercicios" },
  { href: "/blog", label: "Blog" },
  { href: "/calculadoras", label: "Calculadoras" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  // Home: header fijo y transparente sobre el video; sólido al bajar 24 px y
  // escondido mientras se sigue bajando (vuelve al subir). Nunca se esconde
  // en el primer pantallazo, con movimiento reducido ni con el foco dentro
  // (focus-within lo trae de vuelta al tabular).
  const headerRef = useRef<HTMLElement>(null);
  const [solido, setSolido] = useState(false);
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ultimoY = window.scrollY;
    let cuadro = 0;

    const actualizar = () => {
      cuadro = 0;
      const y = window.scrollY;
      setSolido(y > 24);
      if (y < window.innerHeight * 0.9) {
        setOculto(false);
        ultimoY = y;
        return;
      }
      const delta = y - ultimoY;
      if (Math.abs(delta) < 8) return;
      const conFoco = headerRef.current?.contains(document.activeElement) ?? false;
      setOculto(!reducir && delta > 0 && !conFoco);
      ultimoY = y;
    };
    const alScroll = () => {
      if (!cuadro) cuadro = requestAnimationFrame(actualizar);
    };

    cuadro = requestAnimationFrame(actualizar);
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScroll);
      cancelAnimationFrame(cuadro);
    };
  }, [isHome]);

  return (
    <header
      ref={headerRef}
      className={
        isHome
          ? cn(
              "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:translate-y-0 motion-reduce:transition-none",
              solido ? "border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl" : "border-transparent",
              oculto && "-translate-y-full"
            )
          : "sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/75 backdrop-blur-2xl"
      }
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2.5 focus:z-[60] focus:rounded-full focus:bg-orange-500 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-neutral-950"
      >
        Saltar al contenido
      </a>
      <nav
        className={`${
          isHome ? "max-w-7xl px-5 sm:px-8 h-20" : "max-w-6xl px-6 h-16"
        } mx-auto flex items-center justify-between gap-8`}
      >

        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center min-h-11 whitespace-nowrap flex-shrink-0"
          onClick={() => setOpen(false)}
        >
          <Wordmark />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-7 font-display text-[15px] font-semibold uppercase tracking-[0.06em]">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition-colors duration-200 ${
                    active ? "text-orange-400" : "text-white/75 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop: sesión */}
        <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className="font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-white/75 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Button href="/signup" size="sm">
                Crear cuenta
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-3 text-white/60 hover:text-white transition-colors"
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
        <DrawerContent className="bg-neutral-950/95 backdrop-blur-2xl">
          <DrawerTitle className="sr-only">Menú de navegación</DrawerTitle>
          <div className="px-4 py-6 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-3 font-display text-xl font-bold uppercase tracking-[0.04em] rounded-xl transition-all duration-200 ${
                    active
                      ? "text-orange-400 bg-white/[0.06]"
                      : "text-white/75 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {user ? (
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-neutral-950 font-black text-sm">{iniciales(user.nombre)}</span>
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
