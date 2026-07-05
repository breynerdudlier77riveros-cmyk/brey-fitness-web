import type { Metadata } from "next";
import Link from "next/link";
import { programs } from "@/lib/programs";
import ScrollReveal from "@/components/ScrollReveal";
import ProgramsSection from "@/components/ProgramsSection";
import TestimonialsSlider from "@/components/TestimonialsSlider";

export const metadata: Metadata = {
  title: "Programas | Brey Fitness",
  description:
    "Programas de entrenamiento desarrollados con base en biomecánica, fisiología del ejercicio y evidencia científica. Encuentra el programa perfecto para tu objetivo.",
};

/* ── Shared helpers ─────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
      <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/30">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}

function Check() {
  return (
    <svg className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function CheckCell() {
  return (
    <td className="px-4 py-3.5 text-center">
      <svg className="w-4 h-4 text-lime-400 mx-auto" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </td>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function ProgramasPage() {
  const featured = programs.find((p) => p.destacado)!;

  const comparePrograms = [
    programs.find((p) => p.slug === "calistenia-fundamentals")!,
    programs.find((p) => p.slug === "muscle-up-system")!,
    programs.find((p) => p.slug === "planche-master")!,
    programs.find((p) => p.slug === "hipertrofia-inteligente")!,
    programs.find((p) => p.slug === "gym-calistenia")!,
    programs.find((p) => p.slug === "streetlifting")!,
  ];

  const levelLabel: Record<string, string> = {
    principiante: "Principiante",
    intermedio:   "Intermedio",
    avanzado:     "Avanzado",
  };

  const goalLabel: Record<string, string> = {
    fuerza:          "Fuerza",
    hipertrofia:     "Hipertrofia",
    "perdida-grasa": "Pérdida de grasa",
    habilidades:     "Habilidades",
  };

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: "Evidencia científica",
      desc: "Cada programa se basa en principios de fisiología del ejercicio, biomecánica y literatura deportiva actual.",
      color: "text-orange-400 bg-orange-500/[0.08] border-orange-500/15",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      title: "Progresión estructurada",
      desc: "Nada es aleatorio. Cada semana está diseñada para prepararte exactamente para la siguiente.",
      color: "text-lime-400 bg-lime-500/[0.08] border-lime-500/15",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
      title: "Videos en alta definición",
      desc: "Cada ejercicio explicado con ángulos múltiples, errores comunes y correcciones en tiempo real.",
      color: "text-sky-400 bg-sky-500/[0.08] border-sky-500/15",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
      title: "Actualizaciones gratuitas",
      desc: "Acceso de por vida con todas las actualizaciones futuras sin costo adicional.",
      color: "text-violet-400 bg-violet-500/[0.08] border-violet-500/15",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      title: "Seguimiento del progreso",
      desc: "Tablas y hojas de registro para medir tus avances semana a semana con datos reales.",
      color: "text-amber-400 bg-amber-500/[0.08] border-amber-500/15",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 0a1.5 1.5 0 0 1-1.5-1.5v-.75M13.5 9.75h-3M6 9.75h.008v.008H6V9.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      ),
      title: "Compatible con móvil",
      desc: "Accede a tus programas desde cualquier dispositivo, en el parque, en el gym o en casa.",
      color: "text-pink-400 bg-pink-500/[0.08] border-pink-500/15",
    },
  ];

  const steps = [
    { number: "01", title: "Elige tu objetivo", desc: "Fuerza, hipertrofia, habilidades o pérdida de grasa." },
    { number: "02", title: "Selecciona el programa", desc: "Filtra por categoría, nivel y objetivo." },
    { number: "03", title: "Empieza a entrenar", desc: "Acceso inmediato a todos los videos." },
    { number: "04", title: "Registra tu progreso", desc: "Usa las tablas de seguimiento semanales." },
    { number: "05", title: "Consigue resultados", desc: "Llega a tu objetivo con un método real." },
  ];

  const faqs = [
    {
      q: "¿Necesito equipo especial para los programas de calistenia?",
      a: "La mayoría de programas de calistenia solo requieren una barra de dominadas y barras paralelas. Algunos programas avanzados como el Planche Master incluyen variaciones sin barra. Si tienes acceso a un parque de barras, tienes todo lo necesario.",
    },
    {
      q: "¿Cuánto tiempo por día debo entrenar?",
      a: "Depende del programa. Los programas de principiante rondan los 45-60 minutos por sesión, con 3-4 días a la semana. Los programas avanzados pueden requerir hasta 90 minutos, 4-5 días semanales. Siempre se especifica en la guía de cada programa.",
    },
    {
      q: "¿Qué pasa si me quedo estancado en alguna semana?",
      a: "Cada programa incluye protocolos de deload y estrategias para romper estancamientos. Además, el material de soporte explica exactamente qué hacer si una progresión no avanza según lo esperado.",
    },
    {
      q: "¿Puedo hacer dos programas al mismo tiempo?",
      a: "No lo recomendamos. Cada programa está diseñado para maximizar la recuperación y la adaptación en un objetivo específico. Combinar dos programas puede comprometer los resultados de ambos. Termina uno antes de comenzar otro.",
    },
    {
      q: "¿Los programas tienen garantía?",
      a: "Sí. Si sigues el programa tal como está diseñado y no ves resultados en el tiempo indicado, cuentas con soporte directo para revisar tu ejecución y ajustar lo necesario.",
    },
    {
      q: "¿Por cuánto tiempo tengo acceso al programa?",
      a: "El acceso es de por vida. Una vez que adquieres un programa, puedes volver a él cuando quieras, y recibirás todas las actualizaciones futuras sin costo adicional.",
    },
  ];

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 md:px-6 pt-16 pb-24 text-center overflow-hidden">

        {/* Ambient orbs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(249,115,22,0.07) 0%, transparent 70%)" }} />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-600/[0.08] blur-[140px]" />
          <div className="absolute -top-20 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-orange-600/[0.05] blur-[80px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm text-sm text-white/50 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            22 programas · Todos los niveles
          </div>

          {/* H1 */}
          <h1 className="font-black leading-snug tracking-normal mb-8">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
              Encuentra el programa
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 mt-1">
              perfecto para ti.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/35 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Programas desarrollados con base en entrenamiento deportivo,{" "}
            <span className="text-white/60">biomecánica</span>,{" "}
            <span className="text-white/60">fisiología del ejercicio</span>{" "}
            y evidencia científica.
          </p>

          {/* CTA */}
          <a
            href="#programas"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:-translate-y-0.5"
          >
            Explorar programas
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
          </a>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-white/[0.06]">
            {[
              { value: "22", label: "Programas" },
              { value: "+500", label: "Alumnos" },
              { value: "100%", label: "Evidencia científica" },
              { value: "∞", label: "Acceso de por vida" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-orange-400">{value}</p>
                <p className="text-xs text-white/30 mt-1 tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2 + 3. FILTROS + GRID (client)
      ═══════════════════════════════════════════════════════════════ */}
      <ProgramsSection programs={programs} />

      {/* ═══════════════════════════════════════════════════════════════
          4. PROGRAMA DESTACADO — Planche Master
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <ScrollReveal>
          <SectionLabel>Programa destacado</SectionLabel>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Visual */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-950/80 via-indigo-900/40 to-slate-900 border border-purple-500/15">
                {/* Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-purple-500/[0.07]" />
                  <div className="w-44 h-44 rounded-full border border-purple-500/[0.1] absolute" />
                  <div className="w-24 h-24 rounded-full border border-purple-500/[0.15] absolute" />
                </div>
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-20 h-20 text-purple-500/25" fill="none" stroke="currentColor" strokeWidth={0.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                {/* Badge */}
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-yellow-500/25 bg-yellow-500/10 text-yellow-400">
                    ★ Programa Destacado
                  </span>
                </div>
                {/* Glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-purple-600/20 blur-3xl" />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange-400 mb-3">
                  Calistenia · Avanzado
                </p>
                <h2 className="font-black text-4xl md:text-5xl text-white leading-snug">
                  {featured.nombre}
                </h2>
                <p className="text-white/40 mt-4 text-base leading-relaxed">
                  {featured.descripcion}
                </p>
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: featured.duracion, icon: "⏱" },
                  { label: `${featured.cantidadVideos} videos`, icon: "🎬" },
                  { label: featured.precio, icon: "💳" },
                ].map(({ label, icon }) => (
                  <span
                    key={label}
                    className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 text-sm font-medium"
                  >
                    {icon} {label}
                  </span>
                ))}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {featured.beneficios.map((b) => (
                  <div key={b} className="flex items-start gap-2.5">
                    <Check />
                    <span className="text-white/60 text-sm">{b}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 pt-2">
                <button className="px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.35)] cursor-pointer">
                  Más información
                </button>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <svg key={n} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white/30 text-xs ml-1">5.0 · el más valorado</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. COMPARADOR
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <ScrollReveal>
            <SectionLabel>Comparador</SectionLabel>
            <div className="text-center mb-14 -mt-8">
              <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
                Compara y elige.
              </h2>
              <p className="text-white/30 mt-4 max-w-lg mx-auto">
                Una visión clara de los programas más populares para que tomes la mejor decisión.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-4 text-white/40 font-semibold text-xs tracking-wider uppercase w-[200px]">
                      Programa
                    </th>
                    <th className="px-4 py-4 text-white/40 font-semibold text-xs tracking-wider uppercase text-center">Nivel</th>
                    <th className="px-4 py-4 text-white/40 font-semibold text-xs tracking-wider uppercase text-center">Duración</th>
                    <th className="px-4 py-4 text-white/40 font-semibold text-xs tracking-wider uppercase text-center">Objetivo</th>
                    <th className="px-4 py-4 text-white/40 font-semibold text-xs tracking-wider uppercase text-center">Videos</th>
                    <th className="px-4 py-4 text-white/40 font-semibold text-xs tracking-wider uppercase text-center">Seguimiento</th>
                    <th className="px-4 py-4 text-white/40 font-semibold text-xs tracking-wider uppercase text-center">Acceso</th>
                  </tr>
                </thead>
                <tbody>
                  {comparePrograms.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${
                        p.destacado ? "bg-orange-500/[0.04]" : ""
                      } ${i === comparePrograms.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {p.destacado && (
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          )}
                          <span className={`font-bold ${p.destacado ? "text-white" : "text-white/70"}`}>
                            {p.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center text-white/40 capitalize">
                        {levelLabel[p.nivel]}
                      </td>
                      <td className="px-4 py-3.5 text-center text-white/40">{p.duracion}</td>
                      <td className="px-4 py-3.5 text-center text-white/40">{goalLabel[p.objetivo]}</td>
                      <td className="px-4 py-3.5 text-center text-white/60 font-bold">{p.cantidadVideos}</td>
                      <CheckCell />
                      <td className="px-4 py-3.5 text-center text-white/30 text-xs">De por vida</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. ¿POR QUÉ NUESTROS PROGRAMAS?
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <ScrollReveal>
          <SectionLabel>Por qué elegirnos</SectionLabel>
          <div className="text-center mb-14 -mt-8">
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
              Un método diferente.
            </h2>
            <p className="text-white/30 mt-4 max-w-lg mx-auto">
              No vendemos rutinas. Vendemos sistemas diseñados para producir resultados reales.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map(({ icon, title, desc, color }, i) => (
            <ScrollReveal key={title} delay={i * 70}>
              <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 h-full">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${color}`}>
                  {icon}
                </div>
                <div>
                  <h3 className="font-black text-white text-base mb-1.5">{title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. CÓMO FUNCIONA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <ScrollReveal>
            <SectionLabel>El proceso</SectionLabel>
            <div className="text-center mb-16 -mt-8">
              <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
                Cómo funciona.
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <div key={step.number} className="relative flex flex-col items-center text-center gap-4">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-[22px] left-[calc(50%+28px)] right-[-50%] h-px bg-gradient-to-r from-white/15 to-transparent z-0" />
                  )}

                  {/* Number circle */}
                  <div className="relative z-10 w-11 h-11 rounded-full border border-white/[0.1] bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-orange-400">{step.number}</span>
                  </div>

                  <div>
                    <h3 className="font-black text-white text-sm mb-1">{step.title}</h3>
                    <p className="text-white/30 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. TESTIMONIOS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <ScrollReveal>
          <SectionLabel>Lo que dicen</SectionLabel>
          <div className="text-center mb-14 -mt-8">
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
              Resultados reales.
            </h2>
            <p className="text-white/30 mt-4 max-w-lg mx-auto">
              Atletas que siguieron el método y lograron sus objetivos.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <TestimonialsSlider />
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <ScrollReveal>
            <SectionLabel>Preguntas frecuentes</SectionLabel>
            <div className="text-center mb-14 -mt-8">
              <h2 className="font-black text-3xl sm:text-4xl text-white">
                FAQ
              </h2>
              <p className="text-white/30 mt-4">
                Todo lo que necesitas saber antes de empezar.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="divide-y divide-white/[0.06]">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group py-1">
                  <summary className="flex items-center justify-between py-4 cursor-pointer list-none gap-4">
                    <span className="text-white/70 font-semibold text-sm group-open:text-white transition-colors pr-2">
                      {q}
                    </span>
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border border-white/[0.1] bg-white/[0.03] flex items-center justify-center group-open:border-orange-500/30 group-open:bg-orange-500/[0.08] transition-all duration-200">
                      <svg
                        className="w-3 h-3 text-white/30 group-open:text-orange-400 group-open:rotate-45 transition-all duration-200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                  </summary>
                  <div className="pb-5 text-white/35 text-sm leading-relaxed">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. CTA FINAL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-white/[0.05]">
        {/* Ambient */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-orange-600/[0.07] blur-[140px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-amber-500/[0.05] blur-[80px] rounded-full" />
        </div>

        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto px-4 md:px-6 py-24 md:py-44 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/20 mb-8">
              Tu momento es ahora
            </p>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-snug tracking-normal mb-6">
              Comienza hoy tu
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                transformación.
              </span>
            </h2>
            <p className="text-white/35 text-lg mb-14 max-w-md mx-auto leading-relaxed">
              Elige tu programa, accede de inmediato y empieza a entrenar con un método real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#programas"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_50px_rgba(249,115,22,0.45)] hover:-translate-y-0.5"
              >
                Explorar programas
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 text-sm font-medium transition-colors duration-200"
              >
                Leer artículos gratuitos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>

            <p className="text-white/15 text-xs mt-10 tracking-widest uppercase">
              Acceso inmediato · Sin contratos · Garantía de resultados
            </p>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
