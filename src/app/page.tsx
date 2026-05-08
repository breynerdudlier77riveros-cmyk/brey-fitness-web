import Link from "next/link";
import { posts } from "@/lib/content";
import ScrollReveal from "@/components/ScrollReveal";
import CheckoutButton from "@/components/CheckoutButton";

const HOTMART_URL = "https://pay.hotmart.com/XXXXXXXX"; // reemplaza con tu URL real

/* ── Icons ─────────────────────────────────────────────── */
function IconBook() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────────── */
const stats = [
  { value: "+500", label: "Alumnos", sub: "y creciendo cada semana" },
  { value: "12", label: "Semanas", sub: "de programa estructurado" },
  { value: "50+", label: "Videos", sub: "con técnica y rutinas" },
  { value: "30d", label: "Garantía", sub: "devolución sin preguntas" },
];

const includes = [
  {
    id: "ebooks",
    icon: <IconBook />,
    title: "Ebooks & Guías PDF",
    description:
      "Planes de entrenamiento y nutrición completos en PDF. Descárgalos una vez y úsalos de por vida, desde cualquier dispositivo, a tu propio ritmo.",
    accent: "from-orange-500/10 to-transparent",
    iconColor: "text-orange-400",
    large: true,
  },
  {
    id: "videos",
    icon: <IconVideo />,
    title: "Videos Exclusivos",
    description:
      "Más de 50 tutoriales con técnica correcta y rutinas completas.",
    accent: "from-sky-500/8 to-transparent",
    iconColor: "text-sky-400",
    large: false,
  },
  {
    id: "comunidad",
    icon: <IconUsers />,
    title: "Comunidad Privada",
    description:
      "Grupo exclusivo con seguimiento, dudas respondidas y motivación real.",
    accent: "from-lime-500/8 to-transparent",
    iconColor: "text-lime-400",
    large: false,
  },
];

const categoryColor: Record<string, string> = {
  Entrenamiento: "text-emerald-400",
  Nutrición: "text-violet-400",
  Mentalidad: "text-yellow-400",
};

/* ── Section label ─────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
      <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/30">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function HomePage() {
  const previewPosts = posts.slice(0, 3);

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-14 pb-20 md:pt-32 md:pb-44">

        {/* Ambient orbs + radial depth gradient */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 55% at 50% 25%, rgba(99,102,241,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-orange-600/10 blur-[140px]" />
          <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[250px] bg-orange-600/6 blur-[80px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm text-sm text-white/50 mb-10 md:mb-14">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            Programa de Transformación 2026
          </div>

          {/* H1 */}
          <h1 className="font-black leading-snug tracking-normal mb-10 md:mb-14">
            <span className="block text-4xl sm:text-5xl md:text-6xl text-white">
              Transforma
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl text-white">
              tu físico.
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl mt-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
              Con Brey Fitness.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/40 max-w-xl mx-auto mb-12 md:mb-16 leading-[1.8] font-light">
            El sistema completo que ya transformó a más de{" "}
            <span className="text-white/80 font-medium">500 personas</span>.
            Sin excusas, sin gimnasio obligatorio, con resultados reales.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-7 mb-16 md:mb-24">
            <CheckoutButton href={HOTMART_URL} />
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 text-sm font-medium transition-colors duration-200"
            >
              Ver videos gratuitos primero
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* VSL — gradient border */}
          <div className="gradient-border shadow-2xl shadow-black">
            <div className="rounded-[calc(1.5rem-1px)] bg-[#0b0b0b] overflow-hidden">
              <div className="aspect-video flex flex-col items-center justify-center gap-5">
                <button
                  aria-label="Reproducir video"
                  className="w-16 h-16 rounded-2xl bg-orange-500 hover:bg-orange-400 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.45)] hover:shadow-[0_0_70px_rgba(249,115,22,0.55)] transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <p className="text-white/20 text-sm tracking-wide">Ver el video de presentación</p>
              </div>
            </div>
          </div>

          <p className="text-white/20 text-xs mt-6 tracking-widest uppercase">
            Acceso inmediato · Sin contratos · Garantía 30 días
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS BENTO
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-32">
        <ScrollReveal>
          <SectionLabel>Resultados que hablan</SectionLabel>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label, sub }, i) => (
            <ScrollReveal key={label} delay={i * 80}>
              <div className="flex flex-col justify-between p-5 sm:p-7 rounded-3xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm hover:border-lime-500/20 hover:bg-white/[0.05] transition-all duration-300 min-h-[140px] sm:min-h-[160px]">
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-orange-400 leading-snug">
                  {value}
                </p>
                <div>
                  <p className="text-sm font-bold text-white/80 mt-3">{label}</p>
                  <p className="text-xs text-white/30 mt-0.5">{sub}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          INCLUDES BENTO
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-32">
        <ScrollReveal>
          <SectionLabel>Todo lo que obtienes</SectionLabel>
          <div className="text-center mb-16 -mt-8">
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
              Un sistema completo.
            </h2>
            <p className="text-white/30 mt-4 max-w-lg mx-auto">
              Diseñado para darte resultados reales sin importar tu nivel actual.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento: 3-col, Ebooks spans 2 cols + 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[260px] gap-4">
          {includes.map(({ id, icon, title, description, accent, iconColor, large }, i) => (
            <ScrollReveal key={id} delay={i * 100} className={large ? "md:col-span-2 md:row-span-2" : ""}>
              <div
                className={`h-full flex flex-col justify-between p-8 rounded-3xl border border-white/[0.07] bg-gradient-to-br ${accent} bg-white/[0.03] backdrop-blur-sm hover:border-lime-500/[0.18] hover:bg-white/[0.05] transition-all duration-300 group`}
              >
                <div className={`${iconColor} p-3 rounded-2xl bg-white/[0.05] w-fit`}>
                  {icon}
                </div>
                <div>
                  <h3 className={`font-black text-white mb-2 ${large ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                    {title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          BLOG PREVIEW BENTO
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-32">
        <ScrollReveal>
          <SectionLabel>Conocimiento gratuito</SectionLabel>
          <div className="flex items-end justify-between mb-16 -mt-8">
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white">
              Lo último del blog.
            </h2>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/70 transition-colors"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {/* Bento: first post 2-col 2-row, next two fill col 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[220px] gap-4">
          {previewPosts.map((post, i) => (
            <ScrollReveal
              key={post.slug}
              delay={i * 80}
              className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="h-full flex flex-col justify-between p-7 rounded-3xl border border-white/[0.07] bg-white/[0.03] hover:border-lime-500/20 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                {/* Top: badges */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/10 text-white/40">
                    {post.type}
                  </span>
                  <span className={`text-xs font-medium ${categoryColor[post.category]}`}>
                    {post.category}
                  </span>
                </div>

                {/* Bottom: title + excerpt + meta */}
                <div>
                  <h3
                    className={`font-black text-white group-hover:text-orange-400 transition-colors mb-2 leading-snug ${
                      i === 0 ? "text-2xl sm:text-3xl" : "text-lg"
                    }`}
                  >
                    {post.title}
                  </h3>
                  {i === 0 && (
                    <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-white/20">{post.date} · {post.readTime}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-6 sm:hidden">
          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            Ver todos los artículos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-white/[0.05]">
        {/* Deep ambient glow */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/8 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-lime-600/5 blur-[80px] rounded-full" />
        </div>

        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-48 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-white/20 mb-8">
              Tu momento es ahora
            </p>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-snug tracking-normal mb-8">
              ¿Listo para
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                cambiar tu vida?
              </span>
            </h2>
            <p className="text-white/35 text-lg mb-14 max-w-md mx-auto leading-relaxed">
              Únete ahora y empieza tu transformación hoy mismo. Sin excusas, sin esperas.
            </p>

            <CheckoutButton href={HOTMART_URL} />
            <p className="text-white/15 text-xs mt-8 tracking-widest uppercase">
              Acceso inmediato · Garantía de devolución 30 días
            </p>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
