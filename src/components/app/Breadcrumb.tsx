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
  rendimiento: "Performance Assessment",
  evaluacion: "Evaluación",
  entrenamientos: "Entrenamientos",
  calendario: "Calendario",
  historial: "Historial",
  progreso: "Progreso",
  "composicion-corporal": "Composición Corporal",
  perfil: "Perfil",
  biblioteca: "Biblioteca",
  configuracion: "Configuración",
};

/**
 * Segmentos que agrupan rutas pero NO son páginas.
 *
 * `/app/rendimiento/evaluacion` no existe: solo existe
 * `/app/rendimiento/evaluacion/[evaluacionId]`. Enlazarlo llevaba a la ruta
 * `[atletaId]`, que recibía `atletaId = "evaluacion"` y hacía que Postgres
 * rechazara el uuid — un error técnico provocado por la propia navegación.
 *
 * Se declara en vez de deducirse: el breadcrumb es un componente de cliente y
 * no puede consultar el árbol de rutas. Un segmento nuevo sin página tendría
 * que añadirse aquí, y hay un test que comprueba que la lista sigue siendo
 * exactamente la de los directorios sin `page.tsx`.
 */
const SIN_PAGINA = new Set(["evaluacion"]);

export default function Breadcrumb() {
  const segments = useSelectedLayoutSegments();

  const crumbs = [
    { label: "Dashboard", href: "/app", navegable: true },
    ...segments.map((seg, i) => ({
      label: LABELS[seg] ?? seg,
      href: `/app/${segments.slice(0, i + 1).join("/")}`,
      navegable: !SIN_PAGINA.has(seg),
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        // El último nunca es enlace —ya estás ahí—, y un segmento que no tiene
        // página tampoco: llevaría a una ruta que no existe.
        const texto = last || !c.navegable;
        return (
          <span key={c.href} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ArrowRight className="w-3 h-3 text-white/25 flex-shrink-0" strokeWidth={2.5} />}
            {texto ? (
              <span
                className={
                  last ? "text-white font-semibold truncate" : "text-white/50 truncate"
                }
              >
                {c.label}
              </span>
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
