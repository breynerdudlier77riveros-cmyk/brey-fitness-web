import type { Metadata } from "next";
import Link from "next/link";
import { ejercicios } from "@/data/exercises";
import type { MuscleGroup, ExerciseLevel, ExerciseType } from "@/lib/types";
import { ArrowRight } from "@/components/brand/icons";
import Button from "@/components/brand/Button";

export const metadata: Metadata = {
  title: "Biblioteca de Ejercicios — técnica, errores y variantes",
  description:
    "Biblioteca de ejercicios con instrucciones técnicas, errores comunes, variantes y fundamentos biomecánicos. Organizada por grupo muscular, nivel y equipamiento.",
};

const muscleLabelMap: Record<MuscleGroup, string> = {
  pecho: "Pecho",
  espalda: "Espalda",
  hombros: "Hombros",
  brazos: "Brazos",
  piernas: "Piernas",
  core: "Core",
  gluteos: "Glúteos",
  "full-body": "Full Body",
};

const levelColors: Record<ExerciseLevel, string> = {
  principiante: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermedio: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  avanzado: "text-red-400 bg-red-500/10 border-red-500/20",
};

const typeColors: Record<ExerciseType, string> = {
  compuesto: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  aislamiento: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  "peso-corporal": "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const muscles = [
  "todos",
  ...Array.from(new Set(ejercicios.map((e) => e.musculoPrincipal))),
] as const;

export default function EjerciciosPage() {
  const byMuscle = muscles.slice(1).map((m) => ({
    muscle: m as MuscleGroup,
    exercises: ejercicios.filter((e) => e.musculoPrincipal === m),
  }));

  const stats = {
    total: ejercicios.length,
    compuestos: ejercicios.filter((e) => e.tipo === "compuesto").length,
    aislamiento: ejercicios.filter((e) => e.tipo === "aislamiento").length,
    pesoCorporal: ejercicios.filter((e) => e.tipo === "peso-corporal").length,
  };

  return (
    <main className="bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative border-b border-white/[0.05]">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/3 w-[500px] h-[300px] bg-violet-600/6 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-14">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/50 mb-4">
            Biblioteca de ejercicios
          </p>
          <h1 className="font-black text-4xl sm:text-5xl text-white leading-[1.1] tracking-tight mb-4">
            Movimiento con método.
          </h1>
          <p className="text-white/60 max-w-xl leading-relaxed mb-10">
            Instrucciones técnicas, errores comunes, variantes y fundamentos biomecánicos de cada ejercicio. No videos de ego. Información que transforma tu técnica.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Ejercicios", value: stats.total },
              { label: "Compuestos", value: stats.compuestos },
              { label: "Aislamiento", value: stats.aislamiento },
              { label: "Peso corporal", value: stats.pesoCorporal },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-black text-2xl text-white tabular-nums">{s.value}</p>
                <p className="text-[11px] uppercase tracking-widest text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid by muscle */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {byMuscle.map(({ muscle, exercises: exs }) => (
          <div key={muscle}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-black text-lg text-white">{muscleLabelMap[muscle]}</h2>
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-xs text-white/50">{exs.length} ejercicios</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {exs.map((e) => (
                <Link
                  key={e.slug}
                  href={`/ejercicios/${e.slug}`}
                  className="group flex flex-col gap-3 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm text-white leading-snug group-hover:text-orange-100 transition-colors">
                      {e.nombre}
                    </h3>
                    <ArrowRight
                      className="w-4 h-4 text-white/50 group-hover:text-white/90 flex-shrink-0 mt-0.5 transition-colors"
                      strokeWidth={2}
                    />
                  </div>
                  {e.nombreIngles && (
                    <p className="text-[11px] text-white/50">{e.nombreIngles}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-semibold ${levelColors[e.nivel]}`}>
                      {e.nivel}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-semibold ${typeColors[e.tipo]}`}>
                      {e.tipo}
                    </span>
                    {e.equipo.slice(0, 2).map((eq) => (
                      <span key={eq} className="inline-flex px-2 py-0.5 rounded-full border border-white/[0.08] text-[10px] text-white/55">
                        {eq}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.05] py-16 px-6 text-center">
        <p className="text-white/50 text-xs tracking-widest uppercase mb-4">Próximamente</p>
        <h2 className="font-black text-2xl text-white mb-3">
          La biblioteca crece cada semana.
        </h2>
        <p className="text-white/55 text-sm max-w-md mx-auto mb-8">
          Nuevos ejercicios, filtros avanzados por equipamiento y Sistema, y videos demostrativos están en camino.
        </p>
        <Button href="/diagnostico" size="lg">
          Encontrar mi Sistema
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      </section>
    </main>
  );
}
