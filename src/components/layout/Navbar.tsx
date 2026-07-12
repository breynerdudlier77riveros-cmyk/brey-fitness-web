"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Close, Menu } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/bps", label: "El Método" },
  { href: "/programas", label: "Programas" },
  { href: "/ejercicios", label: "Ejercicios" },
  { href: "/blog", label: "Blog" },
  { href: "/calculadoras", label: "Calculadoras" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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

        {/* Desktop CTA */}
        <Button href="/quiz" size="sm" className="hidden md:inline-flex tracking-wide flex-shrink-0">
          ¿Cuál es mi programa?
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Button>

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
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-slate-950/95 backdrop-blur-2xl">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
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
            <Button href="/quiz" size="md" onClick={() => setOpen(false)} className="mt-2 w-full">
              ¿Cuál es mi programa?
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
