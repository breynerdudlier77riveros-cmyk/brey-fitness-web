import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";
import { AlertTriangle, InfoIcon, Check, Lock } from "@/components/brand/icons";
import type { Aviso, Hallazgo, Insight, Suficiencia } from "@/lib/bcs/analysis";

// ── Bloques de análisis (BCS Sprint 2.0) ───────────────────────────────────
// Cuatro bloques con identidad visual propia y deliberadamente distinta,
// porque significan cosas distintas y confundirlos sería engañoso:
//
//   Hallazgos    · neutro   — hechos verificados sobre el dato
//   Alertas      · ámbar    — algo del DATO que conviene revisar (nunca de
//                             la salud de la persona)
//   Insights     · azul     — combinación de hallazgos ya demostrados
//   Limitaciones · gris     — lo que el sistema NO puede interpretar
//
// El ámbar de una alerta jamás es rojo: rojo es error de sistema, y aquí no
// hay ninguno (Design Handbook, ley del color).

const ETIQUETA_SUFICIENCIA: Record<Suficiencia, string> = {
  sin_datos: "Sin datos",
  insuficiente: "Insuficiente",
  parcial: "Parcial",
  suficiente: "Suficiente",
};

function SuficienciaChip({ suficiencia }: { suficiencia: Suficiencia }) {
  return (
    <span
      className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-[0.08em] rounded-full border px-2 py-0.5 ${
        suficiencia === "suficiente"
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
          : "border-white/15 bg-white/[0.04] text-white/50"
      }`}
    >
      {ETIQUETA_SUFICIENCIA[suficiencia]}
    </span>
  );
}

// ── Hallazgos ──────────────────────────────────────────────────────────────

export function FindingsBlock({ hallazgos }: { hallazgos: Hallazgo[] }) {
  if (hallazgos.length === 0) {
    return <NotaSinHistorial>No hay hallazgos que reportar con las mediciones registradas.</NotaSinHistorial>;
  }

  return (
    <ul className="space-y-3">
      {hallazgos.map((h) => (
        <li
          key={h.id}
          className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 flex gap-3"
        >
          <Check className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
              <h4 className="font-bold text-white text-sm">{h.titulo}</h4>
              <div className="flex items-center gap-1.5">
                {h.procedencia && <ProcedenciaBadge procedencia={h.procedencia} />}
                <SuficienciaChip suficiencia={h.suficiencia} />
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{h.descripcion}</p>
            <p className="text-[11px] text-white/30 italic mt-1.5">{h.explicacion}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ── Alertas ────────────────────────────────────────────────────────────────

export function AlertsBlock({ avisos }: { avisos: Aviso[] }) {
  const alertas = avisos.filter((a) => a.tipo === "alerta");
  if (alertas.length === 0) return null;

  return (
    <ul className="space-y-3" aria-label="Datos que conviene revisar">
      {alertas.map((a) => (
        <li
          key={a.id}
          role="status"
          className="rounded-xl border border-yellow-500/25 border-l-4 border-l-yellow-500 bg-yellow-500/[0.06] p-4 flex gap-3"
        >
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div className="min-w-0">
            <h4 className="font-bold text-yellow-100 text-sm mb-0.5">{a.titulo}</h4>
            <p className="text-sm text-yellow-100/70 leading-relaxed">{a.descripcion}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ── Insights ───────────────────────────────────────────────────────────────

export function InsightsBlock({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) {
    return (
      <NotaSinHistorial>
        Todavía no hay interpretaciones disponibles para estas mediciones.
      </NotaSinHistorial>
    );
  }

  return (
    <ul className="space-y-3">
      {insights.map((i) => (
        <li
          key={i.id}
          className="rounded-xl border border-sky-500/25 border-l-4 border-l-sky-500 bg-sky-500/[0.05] p-4 flex gap-3"
        >
          <InfoIcon className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-0.5">
              <h4 className="font-bold text-sky-100 text-sm">{i.titulo}</h4>
              <SuficienciaChip suficiencia={i.suficiencia} />
            </div>
            <p className="text-sm text-sky-100/70 leading-relaxed">{i.descripcion}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ── Limitaciones ───────────────────────────────────────────────────────────

export function LimitationsBlock({ avisos }: { avisos: Aviso[] }) {
  const limitaciones = avisos.filter((a) => a.tipo === "limitacion" || a.tipo === "nota");
  if (limitaciones.length === 0) return null;

  return (
    <ul className="space-y-2.5">
      {limitaciones.map((a) => (
        <li key={a.id} className="flex gap-3">
          <Lock className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-1" strokeWidth={2} />
          <p className="text-xs text-white/45 leading-relaxed">
            <span className="font-semibold text-white/65">{a.titulo}.</span> {a.descripcion}
          </p>
        </li>
      ))}
    </ul>
  );
}
