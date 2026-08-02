"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ArrowRight } from "@/components/brand/icons";

// useSelectedLayoutSegments() (no usePathname() parseado a mano) — API de
// Next.js pensada exactamente para esto: devuelve los segmentos activos
// relativos al layout desde donde se llama (app/app/layout.tsx), ya sin
// el "/app" inicial que habría que recortar manualmente.
const LABELS: Record<string, string> = {
  sistema: "Mi Sistema",
  entrenamientos: "Entrenamientos",
  calendario: "Calendario",
  historial: "Historial",
  progreso: "Progreso",
  "composicion-corporal": "Composición Corporal",
  perfil: "Perfil",
  biblioteca: "Biblioteca",
  configuracion: "Configuración",
};

export default function Breadcrumb() {
  const segments = useSelectedLayoutSegments();

  const crumbs = [
    { label: "Dashboard", href: "/app" },
    ...segments.map((seg, i) => ({
      label: LABELS[seg] ?? seg,
      href: `/app/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={c.href} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ArrowRight className="w-3 h-3 text-white/25 flex-shrink-0" strokeWidth={2.5} />}
            {last ? (
              <span className="text-white font-semibold truncate">{c.label}</span>
            ) : (
              <Link href={c.href} className="text-white/50 hover:text-white transition-colors truncate">
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
