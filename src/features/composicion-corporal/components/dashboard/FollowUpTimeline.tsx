import Link from "next/link";
import Badge from "@/components/brand/Badge";
import type { FilaSeguimiento } from "@/lib/bcs/dashboard";
import { formatearAntiguedad, formatearFechaCorta } from "./formato";

// ── Seguimiento (zona 4) ───────────────────────────────────────────────────
// Ordenado de mayor a menor antigüedad. Muestra CUÁNTO tiempo ha pasado y
// nunca cuándo medir: ninguna fuente del ecosistema documenta periodicidad.

interface Props {
  filas: FilaSeguimiento[];
  limite?: number;
}

export default function FollowUpTimeline({ filas, limite = 10 }: Props) {
  if (filas.length === 0) {
    return <p className="text-xs text-white/40 italic py-2">Sin clientes que mostrar con este filtro.</p>;
  }

  return (
    <ol className="space-y-1">
      {filas.slice(0, limite).map((f) => (
        <li key={f.clienteId}>
          <Link
            href={`/app/composicion-corporal/${f.clienteId}`}
            className="flex items-center justify-between gap-3 py-2.5 px-2 -mx-2 rounded-lg border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group"
          >
            <span className="min-w-0 flex-1">
              <span className="text-sm text-white/85 truncate block group-hover:text-white transition-colors">
                {f.nombre}
              </span>
              <span className="text-[10px] text-white/35">
                {f.totalMediciones} {f.totalMediciones === 1 ? "medición" : "mediciones"}
                {f.ultimaMedicion && ` · última el ${formatearFechaCorta(f.ultimaMedicion)}`}
              </span>
            </span>

            <span className="flex items-center gap-2 flex-shrink-0">
              {f.estado === "archivado" && (
                <Badge variant="neutral" className="text-[9px] px-2 py-0.5">Archivado</Badge>
              )}
              <span className="text-xs text-white/50 tabular-nums whitespace-nowrap">
                {formatearAntiguedad(f.diasSinMedicion)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
