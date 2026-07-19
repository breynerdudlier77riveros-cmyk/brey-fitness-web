"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Rutas propias (enlazables, sobreviven un refresh) en vez de un <Tabs>
// de Radix con estado en memoria — mismo costo de código, misma apariencia
// visual que brand/Tabs.tsx (TabsTrigger), pero Calendario e Historial
// quedan en la URL como corresponde a vistas de este tamaño.
const items = [
  { href: "/app/entrenamientos/calendario", label: "Calendario" },
  { href: "/app/entrenamientos/historial", label: "Historial" },
] as const;

export default function EntrenamientosNav() {
  const pathname = usePathname() ?? "";

  return (
    <div role="tablist" aria-label="Vista de entrenamientos" className="flex gap-2 mb-8 overflow-x-auto">
      {items.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={active}
            className={`flex-none rounded-2xl border px-5 py-3.5 text-xs font-bold transition-all ${
              active
                ? "border-orange-500/30 bg-orange-500/[0.08] text-orange-400"
                : "border-white/[0.07] bg-white/[0.02] text-white/60 hover:text-white/90 hover:border-white/10"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
