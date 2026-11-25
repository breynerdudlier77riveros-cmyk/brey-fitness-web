import { Target, TrendingUp, Clock, ChartBar, Flag } from "@/components/brand/icons";

// ── Flujo visual del Diagnóstico BPS (BREY v3.0, Fase 4) ────────────────────
// El Diagnóstico pasa de "explicado en un párrafo" a protagonista: se
// muestra la forma real de la experiencia (Objetivo → Experiencia → Tiempo
// disponible → Diagnóstico → Sistema recomendado) antes de que el usuario
// haga clic, no solo se describe. Los 3 primeros nodos representan las
// categorías reales del motor (src/lib/diagnostico/preguntas.ts: objetivo,
// experiencia, tiempo — el motor tiene 7 preguntas en total; estos 3 son
// representativos, no una lista exhaustiva, para que se entienda en <5s).

const pasos = [
  { icon: Target, label: "Objetivo" },
  { icon: TrendingUp, label: "Experiencia" },
  { icon: Clock, label: "Tiempo disponible" },
  { icon: ChartBar, label: "Diagnóstico" },
  { icon: Flag, label: "Sistema recomendado" },
] as const;

export default function DiagnosticoFlow() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-y-6 gap-x-1.5 sm:gap-x-2.5 mb-8">
      {pasos.map((paso, i) => (
        <div key={i} className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 ${
                i === pasos.length - 1
                  ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                  : "border-white/[0.10] bg-white/[0.03] text-white/60"
              }`}
            >
              <paso.icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${
                i === pasos.length - 1 ? "text-orange-400" : "text-white/50"
              }`}
            >
              {paso.label}
            </span>
          </div>

          {i < pasos.length - 1 && (
            <div className="w-3 sm:w-8 h-px bg-white/[0.15] mb-5" />
          )}
        </div>
      ))}
    </div>
  );
}
