import type { Metadata } from "next";
import Link from "next/link";
import { sistemas } from "@/data/sistemas";
import ScrollReveal from "@/components/ScrollReveal";
import Button from "@/components/brand/Button";
import { cardStyles } from "@/components/brand/Card";
import Badge from "@/components/brand/Badge";
import { ArrowRight, Check } from "@/components/brand/icons";

export const metadata: Metadata = {
  title: "Sistemas — Un método, cinco caminos",
  description:
    "Los Sistemas de entrenamiento construidos bajo la metodología BPS. El Diagnóstico encuentra el tuyo — y tu nivel de entrada — en 2 minutos.",
};

export default function SistemasPage() {
  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/6 blur-[100px] rounded-full" />
        </div>
        <p className="relative text-[11px] font-semibold tracking-[0.25em] uppercase text-white/50 mb-5">
          The Brey Performance System
        </p>
        <h1 className="relative font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight mb-5">
          Sistemas
        </h1>
        <p className="relative text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
          No vendemos rutinas. Cada Sistema es un ecosistema completo construido bajo la
          metodología BPS — con niveles internos que se adaptan a tu punto de partida.
        </p>
      </section>

      {/* ── Encuentra tu Camino — CTA principal ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/25 bg-orange-500/[0.05] p-8 md:p-12 text-center">
            <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative">
              <h2 className="font-black text-3xl sm:text-4xl text-white mb-4">
                Encuentra tu Camino
              </h2>
              <p className="text-white/60 leading-relaxed max-w-lg mx-auto mb-8">
                No necesitas adivinar qué Sistema elegir. El Diagnóstico BPS analiza tus
                objetivos, experiencia y disponibilidad para recomendarte el Sistema — y el
                nivel — más adecuado para ti.
              </p>
              <Button href="/diagnostico" size="lg">
                Iniciar Diagnóstico BPS
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Button>
              <p className="text-white/40 text-[11px] tracking-[0.18em] uppercase mt-5">
                2 minutos · Sin registro · Gratis
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Los 5 Sistemas ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sistemas.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 70} className={i === 0 ? "md:col-span-2" : ""}>
              <Link
                href={`/sistemas/${s.slug}`}
                className={`${cardStyles.base} ${cardStyles.interactive} group relative flex flex-col overflow-hidden h-full`}
              >
                {/* Cabecera con identidad del sistema */}
                <div className={`relative bg-gradient-to-br ${s.color.gradient} p-6 md:p-7`}>
                  <div aria-hidden className={`absolute top-0 right-0 w-40 h-40 rounded-full ${s.color.glow} blur-3xl`} />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.color.badge}`}>
                        <s.icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold tracking-[0.20em] uppercase ${s.color.accent} mb-2`}>
                          {s.objetivo}
                        </p>
                        <h2 className="font-black text-2xl md:text-3xl text-white leading-snug">
                          {s.nombre}
                        </h2>
                      </div>
                    </div>
                    {s.disponible ? (
                      <Badge variant="success" className="flex-shrink-0 text-[10px] tracking-[0.12em] px-3 py-1.5">
                        Disponible
                      </Badge>
                    ) : (
                      <Badge variant="neutral" className="flex-shrink-0 text-[10px] tracking-[0.12em] px-3 py-1.5">
                        Próximamente
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-6 md:p-7 gap-5">
                  <p className="text-white/55 text-sm leading-relaxed">{s.tagline}</p>

                  {/* Niveles internos */}
                  {s.niveles.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {s.niveles.map((n) => (
                        <span
                          key={n.nombre}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.10] text-white/55"
                        >
                          {n.nombre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* El ecosistema, no una tienda */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {s.ecosistema.map((c) => (
                      <span
                        key={c.etiqueta}
                        className={`flex items-center gap-1.5 text-[11px] ${
                          c.estado === "incluido" ? "text-white/60" : "text-white/40"
                        }`}
                      >
                        {c.estado === "incluido" ? (
                          <Check className={`w-3 h-3 ${s.color.accent} flex-shrink-0`} strokeWidth={3} />
                        ) : (
                          <span aria-hidden className="w-3 h-3 flex items-center justify-center flex-shrink-0 text-white/40">·</span>
                        )}
                        {c.etiqueta}
                        {c.estado === "en-camino" && <span className="text-white/40">(próx.)</span>}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    {s.disponible && s.precioFormato ? (
                      <span className="text-sm text-white/60">
                        Acceso completo · <span className="font-black text-white">{s.precioFormato}</span>
                      </span>
                    ) : (
                      <span className="text-sm text-white/50">Lista de espera abierta</span>
                    )}
                    <span className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${s.color.accent}`}>
                      {s.disponible ? "Explorar el sistema" : "Conocer el sistema"}
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
