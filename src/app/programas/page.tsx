import type { Metadata } from "next";
import Link from "next/link";
import { programas } from "@/data/programs";
import { ArrowRight, Check } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Programas — 5 Ecosistemas de Entrenamiento",
  description:
    "Elige el ecosistema que corresponde a tu nivel, objetivo y equipo disponible. Cada programa es un sistema completo basado en el Brey Performance System.",
};


const nivelLabel: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  todos: 'Todos los niveles',
};

const comparison = [
  { feature: 'Programa de entrenamiento estructurado', start: true,  gym: true,  cal: true,  hybrid: true,  elite: true  },
  { feature: 'Videos de técnica',                      start: true,  gym: true,  cal: true,  hybrid: true,  elite: true  },
  { feature: 'Guía nutricional',                       start: true,  gym: true,  cal: true,  hybrid: true,  elite: true  },
  { feature: 'Tabla de seguimiento',                   start: true,  gym: true,  cal: true,  hybrid: true,  elite: true  },
  { feature: 'Módulo de movilidad y prevención',       start: false, gym: true,  cal: true,  hybrid: true,  elite: true  },
  { feature: 'Protocolo nutricional avanzado',         start: false, gym: true,  cal: false, hybrid: true,  elite: true  },
  { feature: 'Periodización avanzada (RPE/RIR)',        start: false, gym: true,  cal: true,  hybrid: true,  elite: true  },
  { feature: 'Acceso a los 4 ecosistemas',             start: false, gym: false, cal: false, hybrid: false, elite: true  },
  { feature: 'Plan individualizado',                   start: false, gym: false, cal: false, hybrid: false, elite: true  },
  { feature: 'Coaching directo',                       start: false, gym: false, cal: false, hybrid: false, elite: true  },
  { feature: 'Análisis biomecánico mensual',           start: false, gym: false, cal: false, hybrid: false, elite: true  },
];

export default function ProgramasPage() {
  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/6 blur-[100px] rounded-full" />
        </div>
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/50 mb-5">
          The Brey Performance System
        </p>
        <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight mb-5">
          5 ecosistemas.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Un solo método.
          </span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed mb-12">
          Cada programa es un sistema completo — no una colección de rutinas. Elige el que corresponde exactamente a tu nivel, objetivo y equipo disponible.
        </p>

        {/* Quiz CTA card */}
        <div className="max-w-lg mx-auto rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="text-left flex-1">
            <p className="font-bold text-white text-sm mb-1">¿No sabes cuál elegir?</p>
            <p className="text-white/60 text-xs leading-relaxed">
              El diagnóstico analiza tu objetivo, nivel y equipo disponible en 2 minutos.
            </p>
          </div>
          <Link
            href="/diagnostico"
            className="flex-shrink-0 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold transition-all duration-200 whitespace-nowrap"
          >
            Empezar el diagnóstico →
          </Link>
        </div>
      </section>

      {/* ── Program cards ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programas.map((p) => (
            <Link
              key={p.slug}
              href={`/programas/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-500"
            >
              {/* Visual header */}
              <div className={`relative h-32 bg-gradient-to-br ${p.color.gradient} flex items-end p-5`}>
                <div aria-hidden className={`absolute top-0 right-0 w-32 h-32 rounded-full ${p.color.glow} blur-2xl`} />
                <span className={`relative text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border ${p.color.badge}`}>
                  {nivelLabel[p.nivel]}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col p-5 gap-3">
                <div>
                  <h2 className="font-black text-lg text-white group-hover:text-orange-400 transition-colors duration-300 leading-snug">
                    {p.nombre}
                  </h2>
                  <p className="text-white/55 text-xs leading-relaxed mt-1.5 line-clamp-2">
                    {p.tagline}
                  </p>
                </div>

                <ul className="flex flex-col gap-1.5">
                  {p.incluye.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] text-white/60 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="font-black text-lg text-white">{p.precioFormato}</span>
                    <span className="text-white/50 text-xs ml-1">· {p.duracion}</span>
                  </div>
                  <span className="text-xs font-bold text-white/60 group-hover:text-orange-400 flex items-center gap-1 transition-colors duration-300">
                    Ver programa
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/50 mb-4">Comparativa</p>
          <h2 className="font-black text-3xl sm:text-4xl text-white">¿Qué incluye cada sistema?</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left p-4 text-white/50 text-[11px] font-bold tracking-[0.12em] uppercase w-2/5">
                  Función
                </th>
                {programas.map((p) => (
                  <th key={p.slug} className="text-center p-3">
                    <span className="text-[11px] font-bold text-white/60">
                      {p.nombre.replace('Performance ', '')}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => {
                const values = [row.start, row.gym, row.cal, row.hybrid, row.elite];
                return (
                  <tr key={row.feature} className={`border-b border-white/[0.04] ${i % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="p-4 text-white/50 text-xs">{row.feature}</td>
                    {values.map((v, vi) => (
                      <td key={vi} className="p-3 text-center">
                        {v ? (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" strokeWidth={2.5} />
                        ) : (
                          <div className="w-4 h-px bg-white/10 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/[0.05] py-20 px-6 text-center">
        <p className="text-white/50 text-xs tracking-widest uppercase mb-6">¿Listo para empezar?</p>
        <h2 className="font-black text-3xl sm:text-4xl text-white mb-4">
          Encuentra tu programa en 2 minutos.
        </h2>
        <p className="text-white/55 max-w-md mx-auto mb-10">
          El diagnóstico analiza tu objetivo, nivel, equipo y disponibilidad para recomendarte el ecosistema exacto.
        </p>
        <Link
          href="/diagnostico"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-all duration-200"
        >
          Empezar mi diagnóstico
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </Link>
        <p className="text-white/50 text-xs mt-4 tracking-wider uppercase">2 minutos · Sin registro · Gratis</p>
      </section>

    </main>
  );
}
