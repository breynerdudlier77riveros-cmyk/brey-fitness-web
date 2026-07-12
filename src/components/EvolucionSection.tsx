import Link from "next/link";
import { etiquetasMetricas, metricas, metricasListas } from "@/data/metricas";
import ScrollReveal from "@/components/ScrollReveal";
import SectionLabel from "@/components/layout/SectionLabel";
import { cardStyles } from "@/components/ui/Card";
import { ArrowRight } from "@/components/ui/icons";

// ── Acto 7 · El ecosistema — "BREY está evolucionando" ─────────────────────
// Responde: ¿esto crece o ya terminó?
// Dos capas:
//   1. Lo real, enlazado (biblioteca, calculadoras, blog, diagnóstico).
//   2. Lo que viene, como visión sin fechas ni enlaces (ley 5).
// La banda de métricas reales está construida pero DORMIDA: aparece sola
// cuando data/metricas.ts cruce los umbrales D8. Cero números inventados.

const organosReales = [
  { href: "/ejercicios",   nombre: "Biblioteca de ejercicios", detalle: "Técnica, errores y variantes de cada movimiento" },
  { href: "/calculadoras", nombre: "Calculadoras",             detalle: "1RM, TDEE, macros y más — gratis, con evidencia" },
  { href: "/blog",         nombre: "Blog científico",          detalle: "La evidencia, explicada en español claro" },
  { href: "/diagnostico",  nombre: "Diagnóstico BPS",          detalle: "Tu punto de entrada exacto, en 2 minutos" },
];

const enDesarrollo = [
  "Dashboard de entrenamiento",
  "App iOS",
  "App Android",
  "Apple Watch",
  "AI Coach",
  "Nutrición",
  "Comunidad",
  "Wearables",
];

export default function EvolucionSection() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <ScrollReveal>
          <SectionLabel>El ecosistema</SectionLabel>
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white mb-6 -mt-8">
            BREY está evolucionando.
          </h2>
          <p className="text-white/60 leading-relaxed max-w-xl mb-12">
            Cada mes incorporamos nuevas funciones, mejoras y contenido — guiados por la
            evidencia y por la retroalimentación de quienes entrenan con el sistema.
          </p>
        </ScrollReveal>

        {/* Banda de métricas reales — dormida hasta cruzar los umbrales D8 */}
        {metricasListas() && (
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {(Object.keys(metricas) as (keyof typeof metricas)[]).map((k) => (
                <div key={k} className={`${cardStyles.base} p-5`}>
                  <p className="font-black text-2xl md:text-3xl text-orange-400 tabular-nums">
                    {metricas[k].toLocaleString("es-CO")}
                  </p>
                  <p className="text-white/55 text-[11px] mt-1 leading-snug">
                    {etiquetasMetricas[k]}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Lo que ya existe — enlazado */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {organosReales.map((o, i) => (
            <ScrollReveal key={o.href} delay={i * 60}>
              <Link
                href={o.href}
                className={`${cardStyles.base} ${cardStyles.interactive} group p-5 h-full flex flex-col`}
              >
                <h3 className="font-black text-sm text-white group-hover:text-orange-400 transition-colors duration-300 mb-2 flex items-center gap-1.5">
                  {o.nombre}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">{o.detalle}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Lo que viene — visión, sin fechas y sin enlaces */}
        <ScrollReveal>
          <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-white/40 mb-4">
            En desarrollo
          </p>
          <div className="flex flex-wrap gap-2.5 mb-10">
            {enDesarrollo.map((f) => (
              <span
                key={f}
                className="px-4 py-2 rounded-full border border-dashed border-white/[0.12] text-xs font-semibold text-white/50"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="text-white/70 text-sm font-bold">
            Tu sistema de hoy es tu acceso a todo lo que viene.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
