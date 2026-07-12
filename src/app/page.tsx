import Link from "next/link";
import { posts } from "@/lib/content";
import { programas } from "@/data/programs";
import { ejercicios } from "@/data/exercises";
import ScrollReveal from "@/components/ScrollReveal";
import SectionLabel from "@/components/layout/SectionLabel";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import { ArrowRight } from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import DashboardPreview from "@/components/DashboardPreview";

const pillars = [
  {
    num: "01",
    title: "Sobrecarga Progresiva",
    body:  "Cada sesión es un estímulo medible. Sin progresión cuantificada, el cuerpo no tiene razón fisiológica para adaptarse.",
  },
  {
    num: "02",
    title: "Gestión Científica de la Fatiga",
    body:  "Entrenar duro no es lo mismo que entrenar bien. El sistema controla el estrés acumulado para maximizar la adaptación y prevenir el sobreentrenamiento.",
  },
  {
    num: "03",
    title: "Fuerza Relativa y Absoluta",
    body:  "La relación entre tu fuerza y tu peso corporal es el indicador más honesto de rendimiento real. El BPS optimiza ambas.",
  },
  {
    num: "04",
    title: "Nutrición Periodizada",
    body:  "La nutrición no es un complemento — es parte del programa. Cada fase de entrenamiento tiene un protocolo nutricional específico.",
  },
];

const categoryColor: Record<string, string> = {
  Entrenamiento: "text-emerald-400",
  Nutrición:     "text-violet-400",
  Mentalidad:    "text-yellow-400",
};

export default function HomePage() {
  const previewPosts  = posts.slice(0, 3);
  const featuredProgs = programas.slice(0, 3);

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* ════════════════════════════════════════
          HERO — Transformación + producto
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
                <Button href="/quiz" size="lg">
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
          BPS TEASER
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <ScrollReveal>
          <SectionLabel>The Brey Performance System</SectionLabel>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
          <ScrollReveal>
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white leading-snug tracking-tight">
              Una metodología.<br />
              <span className="text-white/60">No una colección</span><br />
              de rutinas.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-white/60 leading-relaxed text-base md:text-lg">
              El BPS es el sistema que unifica sobrecarga progresiva, gestión de fatiga, fuerza relativa y nutrición periodizada en un solo método coherente. Cada programa parte de los mismos principios. Cada fase tiene un propósito. Cada ejercicio tiene una razón.
            </p>
            <Link
              href="/bps"
              className="inline-flex items-center gap-2 mt-6 text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors"
            >
              Conocer el método completo
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </ScrollReveal>
        </div>

        {/* 4 pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.num} delay={i * 80}>
              <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-orange-500/20 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col">
                <span className="font-mono text-[11px] font-bold text-orange-400/60 mb-4">{p.num}</span>
                <h3 className="font-black text-white text-base mb-3 leading-snug">{p.title}</h3>
                <p className="text-white/55 text-xs leading-relaxed flex-1">{p.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          5 PROGRAMAS PREVIEW
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <ScrollReveal>
          <SectionLabel>Los ecosistemas</SectionLabel>
          <div className="flex items-end justify-between mb-12 -mt-8">
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
              5 sistemas.<br />Un solo método.
            </h2>
            <Link
              href="/programas"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white/90 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProgs.map((p, i) => (
            <ScrollReveal key={p.slug} delay={i * 80}>
              <Link
                href={`/programas/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-500 h-full"
              >
                <div className={`h-28 bg-gradient-to-br ${p.color.gradient} flex items-end p-5`}>
                  <span className={`text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border ${p.color.badge}`}>
                    {p.duracion}
                  </span>
                </div>
                <div className="flex-1 p-5">
                  <h3 className="font-black text-base text-white group-hover:text-orange-400 transition-colors duration-300 mb-1.5">
                    {p.nombre}
                  </h3>
                  <p className="text-white/55 text-xs leading-relaxed line-clamp-2 mb-4">{p.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-white">{p.precioFormato}</span>
                    <span className="text-xs font-bold text-white/55 group-hover:text-orange-400 transition-colors flex items-center gap-1">
                      Ver programa
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-4 sm:hidden">
          <Link
            href="/programas"
            className="flex items-center justify-center gap-2 text-sm text-white/55 hover:text-white/90 transition-colors py-4"
          >
            Ver los 5 ecosistemas
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════
          EJERCICIOS TEASER
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <ScrollReveal>
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/50 mb-4">
                Biblioteca de ejercicios
              </p>
              <h2 className="font-black text-3xl sm:text-4xl text-white leading-snug mb-4">
                Cada ejercicio,<br />analizado a fondo.
              </h2>
              <p className="text-white/60 leading-relaxed text-sm max-w-md">
                Técnica paso a paso, errores comunes, músculos involucrados y variantes de cada movimiento. {ejercicios.length} ejercicios hoy — la biblioteca crece cada semana.
              </p>
              <Link
                href="/ejercicios"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 text-sm font-bold transition-all duration-200"
              >
                Explorar ejercicios
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Visual muscle groups */}
            <div className="grid grid-cols-3 gap-2 flex-shrink-0">
              {['Pecho', 'Espalda', 'Hombros', 'Piernas', 'Core', 'Calistenia'].map((g) => (
                <div
                  key={g}
                  className="px-3 py-2 rounded-xl border border-white/[0.07] bg-white/[0.02] text-[10px] font-semibold text-white/60 text-center whitespace-nowrap"
                >
                  {g}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════
          BLOG PREVIEW
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <ScrollReveal>
          <SectionLabel>Conocimiento libre</SectionLabel>
          <div className="flex items-end justify-between mb-12 -mt-8">
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
              Ciencia hecha<br />accesible.
            </h2>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white/90 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[220px] gap-4">
          {previewPosts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 80} className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
              <Link
                href={`/blog/${post.slug}`}
                className="h-full flex flex-col justify-between p-7 rounded-3xl border border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/10 text-white/60">
                    {post.type}
                  </span>
                  <span className={`text-xs font-medium ${categoryColor[post.category]}`}>
                    {post.category}
                  </span>
                </div>
                <div>
                  <h3 className={`font-black text-white group-hover:text-orange-400 transition-colors mb-2 leading-snug ${i === 0 ? "text-xl sm:text-2xl" : "text-base"}`}>
                    {post.title}
                  </h3>
                  {i === 0 && (
                    <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  )}
                  <p className="text-xs text-white/50">{post.date} · {post.readTime}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIOS — se oculta hasta tener reales
      ════════════════════════════════════════ */}
      <TestimonialsSlider />

      {/* ════════════════════════════════════════
          CTA FINAL — Quiz
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
              El quiz analiza tu objetivo, nivel, equipo disponible y situación actual para recomendarte el ecosistema exacto que necesitas.
            </p>
            <Button href="/quiz" size="xl">
              Tomar el quiz gratuito
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </Button>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
