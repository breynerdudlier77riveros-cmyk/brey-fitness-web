import { Check } from "@/components/ui/icons";

// ── Vista previa de la plataforma ───────────────────────────────────────────
// Mockup del dashboard de miembros (v1.1). Es también la spec visual de lo
// que se construirá: lo que se dibuja aquí es lo que existirá.
// REGLA: siempre se muestra con la etiqueta "Vista previa · Plataforma en
// desarrollo" — nunca como producto existente (Constitución, ley 4).
// Datos de ejemplo coherentes con Performance Gym, módulo Fuerza Máxima.

const sesion = [
  { nombre: "Press banca",     esquema: "4 × 5",     intensidad: "RPE 8", hecho: true },
  { nombre: "Press militar",   esquema: "3 × 8",     intensidad: "RIR 2", hecho: false },
  { nombre: "Fondos lastrados", esquema: "3 × AMRAP", intensidad: "RIR 1", hecho: false },
];

// Tonelaje relativo de las últimas 6 semanas (alturas en %)
const tonelaje = [38, 52, 46, 60, 70, 84];

const dias = [
  { d: "L", estado: "hecho" },
  { d: "M", estado: "hecho" },
  { d: "X", estado: "descanso" },
  { d: "J", estado: "hoy" },
  { d: "V", estado: "plan" },
  { d: "S", estado: "plan" },
  { d: "D", estado: "descanso" },
] as const;

const diaEstilo: Record<(typeof dias)[number]["estado"], string> = {
  hecho:    "bg-orange-400",
  hoy:      "bg-white ring-2 ring-orange-400/60",
  plan:     "bg-white/15",
  descanso: "bg-white/[0.06]",
};

export default function DashboardPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`}>
      {/* Glow ambiental */}
      <div aria-hidden className="absolute -inset-8 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

      {/* Etiqueta honesta — innegociable */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-slate-950 text-[10px] font-bold tracking-[0.14em] uppercase text-orange-400">
        Vista previa · Plataforma en desarrollo
      </div>

      {/* Marco de la app */}
      <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-5 sm:p-6">

        {/* Cabecera: hoy entrenas */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-orange-400 mb-1.5">
              Hoy entrenas
            </p>
            <p className="font-black text-white text-lg leading-tight">Empuje · Fuerza</p>
            <p className="text-white/50 text-[11px] mt-1">
              Módulo Fuerza Máxima · Semana 7 de 16
            </p>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-mono font-bold text-white text-sm tabular-nums">44%</span>
            <span className="text-white/50 text-[10px]">del programa</span>
            <div className="w-16 h-1 rounded-full bg-white/[0.08] mt-1.5 overflow-hidden">
              <div className="h-full w-[44%] rounded-full bg-orange-400" />
            </div>
          </div>
        </div>

        {/* Sesión */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.06] mb-4">
          {sesion.map((e) => (
            <div key={e.nombre} className="flex items-center gap-3 px-4 py-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  e.hecho ? "bg-emerald-500/20" : "border border-white/15"
                }`}
              >
                {e.hecho && <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />}
              </div>
              <span className={`flex-1 text-sm font-semibold ${e.hecho ? "text-white/50 line-through" : "text-white"}`}>
                {e.nombre}
              </span>
              <span className="font-mono text-xs text-white/60 tabular-nums">{e.esquema}</span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 text-white/60">
                {e.intensidad}
              </span>
            </div>
          ))}
        </div>

        {/* Progreso + semana */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tonelaje */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-3">
              Tonelaje semanal
            </p>
            <div className="flex items-end gap-1.5 h-12 mb-2">
              {tonelaje.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-sm ${i === tonelaje.length - 1 ? "bg-orange-400" : "bg-orange-400/25"}`}
                />
              ))}
            </div>
            <p className="font-mono text-[11px] text-emerald-400 tabular-nums">e1RM ↗ +8%</p>
          </div>

          {/* Semana + racha */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-3">
                Esta semana
              </p>
              <div className="flex items-center justify-between">
                {dias.map(({ d, estado }, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-white/40 font-medium">{d}</span>
                    <span className={`w-2 h-2 rounded-full ${diaEstilo[estado]}`} />
                  </div>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] text-white/60 mt-3 tabular-nums">
              Racha · <span className="text-white font-bold">12 sesiones</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
