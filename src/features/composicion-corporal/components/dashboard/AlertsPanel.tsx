import Link from "next/link";
import { AlertTriangle } from "@/components/brand/icons";
import type { AlertaAdministrativa, TipoAlerta } from "@/lib/bcs/dashboard";

// ── Alertas administrativas (zona 5) ───────────────────────────────────────
// Hechos sobre el estado administrativo del consultorio, nunca sobre ninguna
// persona ni sobre su evolución. El ámbar señala «revisar un registro», jamás
// una valoración clínica.

const ETIQUETA: Record<TipoAlerta, string> = {
  archivado_con_enlace_activo: "Archivado con enlace activo",
  sin_mediciones: "Sin mediciones",
  multiples_enlaces_activos: "Enlaces duplicados",
  con_mediciones_anuladas: "Con anulaciones",
  con_inconsistencias: "Inconsistencias de registro",
};

export default function AlertsPanel({ alertas }: { alertas: AlertaAdministrativa[] }) {
  if (alertas.length === 0) {
    return (
      <p className="text-xs text-white/45 py-2">
        Ninguna comprobación administrativa señaló registros para revisar.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5" aria-label="Registros administrativos a revisar">
      {alertas.map((a) => (
        <li
          key={a.id}
          className="rounded-xl border border-yellow-500/20 border-l-4 border-l-yellow-500/70 bg-yellow-500/[0.05] p-3 flex gap-3"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                href={`/app/composicion-corporal/${a.clienteId}`}
                className="text-sm font-bold text-yellow-100 hover:underline"
              >
                {a.nombre}
              </Link>
              <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-yellow-400/70">
                {ETIQUETA[a.tipo]}
              </span>
            </div>
            <p className="text-xs text-yellow-100/70 leading-relaxed mt-0.5">{a.hecho}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
