import { Bolt, Check, ChartBar, Cycle } from "@/components/brand/icons";

// ── Flujo visual del ciclo de retención (BREY v3.0, Fase 11) ────────────────
// El objetivo no es explicar una rutina lineal, sino mostrar que el
// entrenamiento en BREY es un CICLO que se repite y compone: el quinto nodo
// repite "Nuevo entrenamiento" (mismo ícono que el primero, resaltado en
// naranja) para comunicar visualmente el regreso al inicio sin necesitar una
// curva SVG de retorno — más robusto y consistente con el lenguaje visual ya
// establecido en DiagnosticoFlow.

const pasos = [
  { icon: Bolt, label: "Entrenamiento" },
  { icon: Check, label: "Registro" },
  { icon: ChartBar, label: "Estadísticas" },
  { icon: Cycle, label: "Adaptación" },
  { icon: Bolt, label: "Nuevo entrenamiento" },
] as const;

export default function RetencionFlow() {
  return (
    <div>
      <div className="flex items-center justify-center flex-wrap gap-y-6 gap-x-1.5 sm:gap-x-2.5">
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

      <p className="text-center text-white/50 text-xs mt-8">
        Y vuelve a empezar — cada semana un poco más fuerte que la anterior.
      </p>
    </div>
  );
}
