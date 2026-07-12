import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { programas, getProgramBySlug } from "@/data/programs";
import { getCheckoutUrl } from "@/data/checkout";
import CheckoutButton from "@/components/CheckoutButton";
import LeadCapture from "@/components/LeadCapture";
import { ArrowRight, Check } from "@/components/ui/icons";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return programas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProgramBySlug(slug);
  if (!p) return {};
  return { title: p.seo.title, description: p.seo.description };
}

const nivelLabel: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  todos: 'Todos los niveles',
};

export default async function ProgramaEcosistemaPage({ params }: Props) {
  const { slug } = await params;
  const p = getProgramBySlug(slug);
  if (!p) notFound();

  const totalSemanas = p.modulos.reduce((acc, m) => acc + m.semanas, 0);
  const checkoutUrl = getCheckoutUrl(p.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.seo.description,
    brand: { "@type": "Brand", name: "Brey Fitness" },
    offers: {
      "@type": "Offer",
      price: p.precio,
      priceCurrency: "USD",
      availability: checkoutUrl
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ── Hero ── */}
      <section className={`relative bg-gradient-to-br ${p.color.gradient} border-b border-white/[0.07]`}>
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full ${p.color.glow} blur-[120px]`} />
          <div className={`absolute bottom-0 left-0 w-[400px] h-[200px] rounded-full ${p.color.glow} blur-[100px]`} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] text-white/55 mb-8 font-medium">
            <Link href="/programas" className="hover:text-white/90 transition-colors">Programas</Link>
            <span>/</span>
            <span className={p.color.accent}>{p.nombre}</span>
          </div>

          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className={`text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border ${p.color.badge}`}>
              {nivelLabel[p.nivel]}
            </span>
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border border-white/10 text-white/60">
              {p.duracion}
            </span>
            {totalSemanas > 0 && (
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border border-white/10 text-white/60">
                {p.modulos.length} módulos
              </span>
            )}
          </div>

          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight mb-5 max-w-3xl">
            {p.nombre}
          </h1>
          <p className={`text-lg sm:text-xl font-medium ${p.color.accent} mb-6`}>
            {p.tagline}
          </p>
          <p className="text-white/50 text-base leading-relaxed max-w-2xl mb-10">
            {p.descripcion}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#acceso"
              className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full ${p.color.cta} text-white font-bold text-sm transition-all duration-200`}
            >
              Empezar con {p.nombre}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:border-white/20 font-bold text-sm transition-all duration-200"
            >
              Tomar el quiz primero
            </Link>
          </div>
        </div>
      </section>

      {/* ── Para quién es ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-b border-white/[0.05]">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className={`text-[11px] font-bold tracking-[0.20em] uppercase ${p.color.accent} mb-4`}>
              Para quién es
            </p>
            <h2 className="font-black text-3xl sm:text-4xl text-white leading-snug mb-5">
              Este programa es exactamente para ti si...
            </h2>
            <p className="text-white/60 leading-relaxed">{p.para}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-5">Lo que incluye</p>
            <ul className="flex flex-col gap-3">
              {p.incluye.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className={`w-4 h-4 ${p.color.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-sm text-white/60 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Módulos ── */}
      {p.modulos.some(m => m.semanas > 0) && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-white/[0.05]">
          <div className="text-center mb-12">
            <p className={`text-[11px] font-bold tracking-[0.20em] uppercase ${p.color.accent} mb-4`}>
              Estructura del programa
            </p>
            <h2 className="font-black text-3xl sm:text-4xl text-white">
              {p.modulos.length} módulos. {totalSemanas} semanas.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {p.modulos.map((mod, i) => (
              <div
                key={mod.nombre}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-9 h-9 rounded-full ${p.color.badge} border flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs font-black ${p.color.accent}`}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base text-white leading-snug">{mod.nombre}</h3>
                    {mod.semanas > 0 && (
                      <p className="text-[11px] text-white/50 mt-1">
                        {mod.semanas} semanas · {mod.sesionesSemanales}x/semana
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{mod.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Elite: acceso a todos los módulos ── */}
      {p.slug === 'performance-elite' && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-white/[0.05]">
          <div className="text-center mb-12">
            <p className={`text-[11px] font-bold tracking-[0.20em] uppercase ${p.color.accent} mb-4`}>
              Acceso total
            </p>
            <h2 className="font-black text-3xl sm:text-4xl text-white">
              Todos los ecosistemas incluidos.
            </h2>
            <p className="text-white/55 mt-4 max-w-xl mx-auto">
              Performance Elite incluye acceso completo a los 4 sistemas de entrenamiento de la plataforma.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {['Performance Start', 'Performance Gym', 'Performance Calisthenics', 'Performance Hybrid'].map((name) => (
              <div key={name} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                <Check className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-white/70">{name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Final ── */}
      <section id="acceso" className="relative overflow-hidden border-t border-white/[0.05] scroll-mt-16">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-orange-600/6 blur-[100px] rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-white/50 text-xs tracking-widest uppercase mb-6">
            Precio · {p.precioFormato}
          </p>
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white leading-snug mb-6">
            Empieza con<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              {p.nombre}
            </span>
          </h2>
          <p className="text-white/55 mb-10 max-w-md mx-auto leading-relaxed">
            {p.tagline} Sistema completo, acceso inmediato y garantía de 30 días.
          </p>
          {checkoutUrl ? (
            <>
              <CheckoutButton
                href={checkoutUrl}
                label={`Acceder ahora — ${p.precioFormato}`}
              />
              <p className="text-white/50 text-xs mt-6 tracking-widest uppercase">
                Acceso inmediato · Garantía 30 días · Sin contratos
              </p>
            </>
          ) : (
            <div className="max-w-md mx-auto">
              <LeadCapture
                source={`programa-${p.slug}`}
                title="El acceso abre muy pronto. Déjanos tu email y sé el primero en entrar:"
                buttonLabel="Avisarme"
              />
            </div>
          )}
          <div className="mt-8">
            <Link
              href="/programas"
              className="inline-flex items-center justify-center gap-2 text-sm text-white/55 hover:text-white/90 transition-colors"
            >
              Ver todos los programas
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
