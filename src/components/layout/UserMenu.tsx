"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/supabase/actions";
import { iniciales } from "@/lib/utils";
import type { NavUser } from "@/lib/supabase/user";

// ── Avatar + menú del Navbar de marketing, sesión activa ────────────────────
// Dropdown controlado (no <details>, a diferencia del acordeón de /faq):
// un menú de usuario sí necesita cerrarse al hacer clic fuera, algo que
// <details> nativo no da gratis — y Navbar.tsx ya es "use client", así
// que el estado extra no añade un nuevo límite de cliente.

export default function UserMenu({ user, onNavigate }: { user: NavUser; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  function cerrar() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú de cuenta"
        aria-expanded={open}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0 cursor-pointer"
      >
        <span className="text-white font-black text-[10px]">{iniciales(user.nombre)}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/[0.08] bg-slate-950 shadow-xl shadow-black/40 py-2 z-50">
          <p className="px-3.5 py-1.5 text-xs font-bold text-white truncate">{user.nombre}</p>
          <div className="h-px bg-white/[0.06] my-1" />
          <Link
            href="/app/perfil"
            onClick={cerrar}
            className="block px-3.5 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            Mi Perfil
          </Link>
          <Link
            href="/app"
            onClick={cerrar}
            className="block px-3.5 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            Dashboard
          </Link>
          <div className="h-px bg-white/[0.06] my-1" />
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left px-3.5 py-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
