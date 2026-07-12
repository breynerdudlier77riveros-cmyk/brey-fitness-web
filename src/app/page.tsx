import Link from "next/link";
import { sistemas } from "@/data/sistemas";
import ScrollReveal from "@/components/ScrollReveal";
import SectionLabel from "@/components/layout/SectionLabel";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import { ArrowRight } from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import { cardStyles } from "@/components/ui/Card";
import DashboardPreview from "@/components/DashboardPreview";
import FounderSection from "@/components/FounderSection";
import EvolucionSection from "@/components/EvolucionSection";

// ── Acto 2 · Manifiesto ─────────────────────────────────────────────────────
const creencias = [
  { no: "No creemos en copiar rutinas.",  si: "Creemos en entender el entrenamiento." },
  { no: "No creemos en tendencias.",      si: "Creemos en evidencia científica." },
  { no: "No creemos en entrenar más.",    si: "Creemos en entrenar mejor." },
  { no: "No creemos en improvisar.",      si: "Creemos en sistemas." },
];

// ── Acto 3 · Los tres pilares del sistema ───────────────────────────────────
const sistema = [
  {
    titulo: "Ciencia",
    cuerpo:
      "Cada variable del Sistema — volumen, intensidad, frecuencia, descanso — proviene de literatura científica publicada, no de la rutina de moda. Si no hay evidencia que lo respalde, no entra al sistema.",
  },
  {
    titulo: "Planificación",
    cuerpo:
      "El azar no produce adaptación. Cada sesión existe dentro de una estructura periodizada: sabes qué toca hoy, qué viene después y qué objetivo fisiológico persigue cada fase.",
  },
  {
    titulo: "Seguimiento",
    cuerpo:
      "Lo que no se mide no progresa. Peso, series, RPE y RIR convierten cada sesión en datos — y los datos convierten el estancamiento en una decisión de ajuste, no en un misterio.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* ════════════════════════════════════════
          ACTO 1 · HERO — Transformación + producto
          Responde: ¿por qué debería quedarme?
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-orange-600/8 blur-[140px]" />
          <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[200px] bg-orange-600/5 blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-20 md:pb-28 lg:min-h-[88vh] flex items-center">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-10 items-center w-full">

            {/* Columna de mensaje */}
            <div className="text-center lg:text-left">
              <div className="hero-enter inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm text-sm text-white/50 mb-8 md:mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                The Brey Performance System
              </div>

              <h1 className="hero-enter hero-enter-2 font-black leading-[1.06] tracking-tight mb-7">
                <span className="block text-4xl sm:text-5xl lg:text-6xl text-white">
                  El fin del
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl text-white">
                  entrenamiento
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                  a ciegas.
                </span>
              </h1>

              <p className="hero-enter hero-enter-3 text-lg text-white/60 max-w-xl mx-auto lg:mx-0 mb-10 leading-[1.8] font-light">
                Un sistema que convierte la evidencia científica en un camino claro: qué hacer hoy, por qué hacerlo, y qué esperar de tu cuerpo mañana.
              </p>

              <div className="hero-enter hero-enter-4 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mb-10">
                <Button href="/diagnostico" size="lg">
                  Empezar mi diagnóstico
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </Button>
                <Button href="/bps" variant="outline" size="md" className="px-7 py-3.5">
                  Conocer el sistema
                </Button>
              </div>

              {/* Indicadores de confianza — solo datos verdaderos */}
              <div className="hero-enter hero-enter-4 flex flex-wrap items-center lg:justify-start justify-center gap-x-3 gap-y-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-white/50">
                <span>Referencias científicas publicadas</span>
                <span aria-hidden className="text-orange-400/60">·</span>
                <span>72 semanas de programación</span>
                <span aria-hidden className="text-orange-400/60">·</span>
                <span>Garantía 30 días</span>
              </div>
            </div>

            {/* Columna de producto */}
            <DashboardPreview className="preview-enter mt-2 lg:mt-0" />

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ACTO 2 · MANIFIESTO — El ADN
          Responde: ¿en qué cree esta empresa?
      ════════════════════════════════════════ */}
      <section className="border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-24 md:py-36">
          <ScrollReveal>
            <SectionLabel>En qué creemos</SectionLabel>
          </ScrollReveal>

          <div className="flex flex-col gap-14 md:gap-20 text-center">
            {creencias.map((c, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <p className="text-white/40 text-base md:text-lg font-medium mb-3">
                  {c.no}
                </p>
                <p className="font-black text-2xl sm:text-3xl md:text-[2.6rem] md:leading-[1.25] text-white text-balance">
                  {c.si}
                </p>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <div aria-hidden className="w-10 h-px bg-orange-400/40 mx-auto mb-8" />
              <p className="font-black text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 tracking-tight">
                Esto es el Brey Performance System.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ACTO 3 · EL SISTEMA
          Responde: ¿por qué funciona?
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <ScrollReveal>
          <SectionLabel>El sistema</SectionLabel>
          <div className="flex items-end justify-between gap-6 mb-6 -mt-8">
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
              ¿Por qué funciona?
            </h2>
            <Link
              href="/bps"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 font-bold transition-colors flex-shrink-0"
            >
              Conocer el método completo
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
          <p className="text-white/60 leading-relaxed max-w-xl mb-12">
            El BPS se sostiene sobre tres pilares. Quita cualquiera de los tres y deja de funcionar.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-4">
          {sistema.map((p, i) => (
            <ScrollReveal key={p.titulo} delay={i * 80}>
              <div className={`${cardStyles.base} ${cardStyles.interactive} p-7 h-full flex flex-col`}>
                <h3 className="font-black text-xl text-orange-400 mb-4">{p.titulo}</h3>
                <p className="text-white/60 text-sm leading-relaxed flex-1">{p.cuerpo}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-6 sm:hidden">
          <Link
            href="/bps"
            className="flex items-center justify-center gap-2 text-sm text-orange-400 hover:text-orange-300 font-bold transition-colors py-3"
          >
            Conocer el método completo
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════
          ACTO 4 · SISTEMAS — Encuentra tu Camino
          Responde: ¿cuál es para mí?
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <ScrollReveal>
          <SectionLabel>Sistemas</SectionLabel>
        </ScrollReveal>

        {/* Encuentra tu Camino — CTA principal antes de los Sistemas */}
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/25 bg-orange-500/[0.05] p-8 md:p-12 text-center mb-12">
            <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative">
              <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white mb-4">
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
            </div>
          </div>
        </ScrollReveal>

        {/* Los 5 Sistemas — CTA secundario */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sistemas.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 80}>
              <Link
                href={`/sistemas/${s.slug}`}
                className={`${cardStyles.base} ${cardStyles.interactive} group flex flex-col overflow-hidden h-full`}
              >
                <div className={`h-24 bg-gradient-to-br ${s.color.gradient} flex items-end p-5`}>
                  {s.disponible ? (
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
                      Disponible
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.05] text-white/60">
                      Próximamente
                    </span>
                  )}
                </div>
                <div className="flex-1 p-5">
                  <h3 className="font-black text-base text-white group-hover:text-orange-400 transition-colors duration-300 mb-1">
                    {s.nombre}
                  </h3>
                  <p className={`text-[11px] font-semibold ${s.color.accent} mb-2`}>{s.objetivo}</p>
                  <p className="text-white/55 text-xs leading-relaxed line-clamp-2 mb-4">{s.tagline}</p>
                  <div className="flex items-center justify-between">
                    {s.disponible && s.precioFormato ? (
                      <span className="font-black text-base text-white">{s.precioFormato}</span>
                    ) : (
                      <span className="text-xs text-white/50">Lista de espera</span>
                    )}
                    <span className="text-xs font-bold text-white/55 group-hover:text-orange-400 transition-colors flex items-center gap-1">
                      Explorar
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}

          {/* Sexta casilla: el catálogo completo */}
          <ScrollReveal delay={5 * 80}>
            <Link
              href="/sistemas"
              className={`${cardStyles.base} ${cardStyles.interactive} group h-full flex flex-col items-center justify-center gap-3 p-6 text-center`}
            >
              <p className="font-black text-base text-white group-hover:text-orange-400 transition-colors">
                Ver los Sistemas en detalle
              </p>
              <p className="text-white/50 text-xs leading-relaxed max-w-[220px]">
                Niveles internos, fases y todo lo que incluye cada ecosistema.
              </p>
              <ArrowRight className="w-4 h-4 text-white/55 group-hover:text-orange-400 transition-colors" strokeWidth={2.5} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ACTO 6 · FUNDADOR
          Responde: ¿por qué confiar en BREY?
      ════════════════════════════════════════ */}
      <FounderSection />

      {/* ════════════════════════════════════════
          ACTO 7 · EL ECOSISTEMA — BREY evoluciona
          Responde: ¿esto crece o ya terminó?
      ════════════════════════════════════════ */}
      <EvolucionSection />

      {/* ════════════════════════════════════════
          TESTIMONIOS — se oculta hasta tener reales
      ════════════════════════════════════════ */}
      <TestimonialsSlider />

      {/* ════════════════════════════════════════
          ACTO 8 · CTA FINAL — Diagnóstico
          Responde: ¿qué hago ahora?
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-white/[0.05]">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/6 blur-[120px] rounded-full" />
        </div>

        <ScrollReveal>
          <div className="relative max-w-2xl mx-auto px-4 md:px-6 py-20 md:py-40 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/50 mb-8">
              2 minutos · Sin registro · Gratis
            </p>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-snug tracking-tight mb-6">
              ¿No sabes por<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                dónde empezar?
              </span>
            </h2>
            <p className="text-white/55 text-lg mb-12 max-w-md mx-auto leading-relaxed">
              El diagnóstico analiza tu objetivo, nivel, equipo y situación actual para recomendarte el ecosistema exacto — y explicarte por qué.
            </p>
            <Button href="/diagnostico" size="xl">
              Empezar mi diagnóstico
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </Button>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
