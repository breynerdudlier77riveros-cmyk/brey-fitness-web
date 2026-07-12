import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import SectionLabel from "@/components/layout/SectionLabel";
import { ArrowRight, Close } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "The Brey Performance System — La Metodología",
  description:
    "El BPS es el sistema de entrenamiento que unifica sobrecarga progresiva, gestión de fatiga, fuerza relativa y nutrición periodizada en un método coherente y respaldado por evidencia científica.",
};

const pillars = [
  {
    num: "01",
    title: "Sobrecarga Progresiva Inteligente",
    body: "La adaptación fisiológica no ocurre por accidente — ocurre cuando el cuerpo recibe un estímulo mayor al que ya está acostumbrado a manejar. El BPS cuantifica cada sesión: peso, volumen, RPE y RIR son las variables que determinan si hay progresión real o solo movimiento.",
    science: "ACSM, 2009 · Krieger, 2010 · Schoenfeld, 2017",
  },
  {
    num: "02",
    title: "Gestión Científica de la Fatiga",
    body: "La fatiga acumulada enmascara la forma física real. Entrenar constantemente al fallo sin recuperación adecuada no produce más músculo — produce estancamiento y lesiones. El BPS estructura el volumen, la intensidad y el descanso para maximizar la señal anabólica y minimizar el daño innecesario.",
    science: "Pareja-Blanco et al., 2017 · Zourdos et al., 2016",
  },
  {
    num: "03",
    title: "Fuerza Relativa y Absoluta",
    body: "La fuerza absoluta (cuánto levantas) y la fuerza relativa (cuánto levantas en relación a tu peso corporal) son indicadores complementarios de rendimiento real. Un atleta del BPS desarrolla ambas — porque ninguna aísla por completo la capacidad del sistema neuromuscular.",
    science: "Suchomel et al., 2016 · Dos'Santos et al., 2021",
  },
  {
    num: "04",
    title: "Nutrición Periodizada",
    body: "La nutrición no es un protocolo genérico aplicado encima del entrenamiento — es parte del sistema. Cada fase del programa (volumen, fuerza, definición) requiere ajustes específicos en calorías, distribución de macros y timing. El BPS integra el protocolo nutricional dentro del programa, no como un anexo.",
    science: "Helms et al., 2014 · Iraki et al., 2019",
  },
];

const manifiesto = [
  {
    no: "No creemos en copiar rutinas.",
    si: "Creemos en entender el entrenamiento.",
    porque:
      "Una rutina copiada funciona hasta que deja de hacerlo — y entonces no sabes qué ajustar. Entender por qué funciona te acompaña toda la vida de entrenamiento.",
  },
  {
    no: "No creemos en tendencias.",
    si: "Creemos en evidencia científica.",
    porque:
      "Las tendencias cambian cada año. Los principios fisiológicos que gobiernan tu adaptación — sobrecarga, recuperación, especificidad — no han cambiado en décadas.",
  },
  {
    no: "No creemos en entrenar más.",
    si: "Creemos en entrenar mejor.",
    porque:
      "El volumen sin dirección es fatiga gratis. La dosis correcta de estímulo, en el momento correcto de la fase correcta, es lo que produce progreso medible.",
  },
  {
    no: "No creemos en improvisar.",
    si: "Creemos en sistemas.",
    porque:
      "La motivación fluctúa; es humano. Un sistema decide por ti los días en que la motivación no aparece — y esos días son los que separan el progreso del abandono.",
  },
];

const steps = [
  {
    step: "1",
    title: "Diagnóstico",
    body:  "Evaluamos tu nivel, objetivo, equipo disponible, historial de lesiones y tiempo disponible para diseñar el punto de entrada correcto.",
  },
  {
    step: "2",
    title: "Ecosistema de programa",
    body:  "Eres asignado al ecosistema que corresponde a tu diagnóstico. Cada ecosistema es un sistema completo, no un plan genérico.",
  },
  {
    step: "3",
    title: "Progresión por fases",
    body:  "Cada ecosistema está estructurado en módulos. Cada módulo tiene un objetivo fisiológico específico. La progresión es deliberada, no aleatoria.",
  },
  {
    step: "4",
    title: "Medición y ajuste",
    body:  "Cada sesión produce datos. Esos datos alimentan el ajuste del siguiente bloque. El BPS no es estático — se adapta a tu respuesta.",
  },
];

export default function BPSPage() {
  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative border-b border-white/[0.05]">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] bg-orange-600/7 blur-[130px] rounded-full" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/[0.06] text-xs text-orange-400 font-semibold tracking-wide mb-10">
            Metodología · Evidencia científica
          </div>

          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] tracking-tight mb-8 max-w-4xl">
            The Brey<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Performance System
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
            El sistema que unifica sobrecarga progresiva, gestión científica de la fatiga, fuerza relativa y nutrición periodizada en un método coherente. No es una colección de rutinas. Es una arquitectura de entrenamiento.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/quiz" size="md" className="px-7 py-3.5">
              Encontrar mi programa
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
            <Button href="/programas" variant="outline" size="md" className="px-7 py-3.5">
              Ver los 5 ecosistemas
            </Button>
          </div>
        </div>
      </section>

      {/* ── El problema ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-b border-white/[0.05]">
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>El problema</SectionLabel>
              <h2 className="font-black text-3xl sm:text-4xl text-white leading-snug mb-6 -mt-8">
                La mayoría no entrena mal.<br />
                <span className="text-white/60">Entrena sin sistema.</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                El problema no es la falta de esfuerzo. El problema es la ausencia de una arquitectura que conecte el entrenamiento de hoy con el rendimiento de mañana.
              </p>
              <p className="text-white/60 leading-relaxed">
                Rutinas aleatorias de internet, cambios de programa cada mes, volumen sin control y nutrición improvisada producen fatiga acumulada sin adaptación real. El cuerpo trabaja, pero no progresa.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Cambiar de rutina cada 4-6 semanas sin razón",
                "Volumen sin control — más no es siempre mejor",
                "Entrenar al fallo en cada sesión",
                "Nutrición desconectada del programa",
                "Sin métricas — sin forma de saber si hay progresión",
                "Cardio que interfiere con la ganancia muscular",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-red-500/10 bg-red-500/[0.04]">
                  <Close className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-sm text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Los 4 pilares ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-b border-white/[0.05]">
        <ScrollReveal>
          <SectionLabel>Los 4 pilares del BPS</SectionLabel>
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white text-center leading-snug mb-14 -mt-8">
            La base científica del sistema.
          </h2>
        </ScrollReveal>

        <div className="space-y-4">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.num} delay={i * 80}>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:border-orange-500/15 hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <span className="font-mono text-[11px] font-bold text-orange-400/60">{p.num}</span>
                    <h3 className="font-black text-xl text-white mt-1 leading-snug max-w-[200px] sm:max-w-none">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-white/60 leading-relaxed text-sm mb-4">{p.body}</p>
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-orange-400/40">
                      {p.science}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-b border-white/[0.05]">
        <ScrollReveal>
          <SectionLabel>Cómo funciona</SectionLabel>
          <h2 className="font-black text-3xl sm:text-4xl text-white text-center mb-14 -mt-8">
            Del diagnóstico al rendimiento.
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 80}>
              <div className="flex flex-col h-full p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <div className="w-9 h-9 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center mb-5 flex-shrink-0">
                  <span className="text-xs font-black text-orange-400">{s.step}</span>
                </div>
                <h3 className="font-black text-white text-sm mb-3">{s.title}</h3>
                <p className="text-white/55 text-xs leading-relaxed flex-1">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Manifiesto — versión extendida ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-b border-white/[0.05]">
        <ScrollReveal>
          <SectionLabel>En qué creemos</SectionLabel>
          <h2 className="font-black text-3xl sm:text-4xl text-white text-center leading-snug mb-14 -mt-8">
            El ADN del sistema.
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4">
          {manifiesto.map((m, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-orange-500/15 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col">
                <p className="text-white/40 text-sm font-medium mb-2">{m.no}</p>
                <h3 className="font-black text-xl text-white mb-4 leading-snug">{m.si}</h3>
                <p className="text-white/55 text-sm leading-relaxed flex-1">{m.porque}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-600/6 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <p className="text-white/50 text-xs tracking-widest uppercase mb-6">Siguiente paso</p>
          <h2 className="font-black text-4xl sm:text-5xl text-white mb-6">
            Encuentra tu ecosistema.
          </h2>
          <p className="text-white/55 mb-10 max-w-lg mx-auto leading-relaxed">
            El quiz de 2 minutos analiza tu objetivo, nivel y equipo disponible para recomendarte el programa exacto del Brey Performance System.
          </p>
          <Button href="/quiz" size="lg" className="px-9 text-sm">
            Tomar el quiz gratuito
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Button>
          <p className="text-white/50 text-xs mt-4 tracking-wider uppercase">2 minutos · Sin registro · Gratis</p>
        </div>
      </section>

    </main>
  );
}
