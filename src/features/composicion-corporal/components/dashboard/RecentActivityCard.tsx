import Link from "next/link";
import type { EventoReciente, TipoEvento } from "@/lib/bcs/dashboard";
import { formatearFechaCorta } from "./formato";

// ── Actividad reciente (zona 7) ────────────────────────────────────────────
// Solo cronológico. Sin agrupar por importancia: el orden es el del tiempo.

const PUNTO: Record<TipoEvento, string> = {
  medicion_registrada: "bg-orange-400",
  cliente_creado: "bg-emerald-400",
  enlace_generado: "bg-sky-400",
  enlace_revocado: "bg-white/30",
  medicion_anulada: "bg-yellow-400",
};

export default function RecentActivityCard({ eventos }: { eventos: EventoReciente[] }) {
  if (eventos.length === 0) {
    return <p className="text-xs text-white/40 italic py-2">Sin actividad registrada.</p>;
  }

  return (
    <ol className="space-y-0.5">
      {eventos.map((e) => (
        <li key={e.id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
          <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PUNTO[e.tipo]}`} />
          <span className="min-w-0 flex-1">
            <Link
              href={`/app/composicion-corporal/${e.clienteId}`}
              className="text-sm text-white/80 hover:text-white transition-colors truncate block"
            >
              {e.nombre}
            </Link>
            <span className="text-[10px] text-white/35">{e.descripcion}</span>
          </span>
          <time className="text-[10px] text-white/35 tabular-nums flex-shrink-0" dateTime={e.fecha}>
            {formatearFechaCorta(e.fecha)}
          </time>
        </li>
      ))}
    </ol>
  );
}
