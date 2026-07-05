"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
                    active ? "text-white" : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/quiz"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white text-xs font-bold tracking-wide transition-all duration-200 flex-shrink-0"
        >
          ¿Cuál es mi programa?
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-white/40 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
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
            <Link
              href="/quiz"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-3 rounded-full bg-orange-500 text-white text-sm font-bold text-center"
            >
              ¿Cuál es mi programa? →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
