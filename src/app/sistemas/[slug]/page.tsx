import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sistemas, getSistemaBySlug } from "@/data/sistemas";
import { getCheckoutUrl } from "@/data/checkout";
import CheckoutButton from "@/components/CheckoutButton";
import LeadCapture from "@/components/LeadCapture";
import WaitlistForm from "@/components/WaitlistForm";
import { cardStyles } from "@/components/brand/Card";
import Badge from "@/components/brand/Badge";
import { ArrowRight, Check } from "@/components/brand/icons";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return sistemas.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSistemaBySlug(slug);
  if (!s) return {};
  return { title: s.seo.title, description: s.seo.description };
}

export default async function SistemaPage({ params }: Props) {
  const { slug } = await params;
  const s = getSistemaBySlug(slug);
  if (!s) notFound();

  const totalSemanas = s.fases.reduce((acc, f) => acc + f.semanas, 0);
  const checkoutUrl = getCheckoutUrl(s.slug);

  // Datos estructurados solo para Sistemas realmente a la venta.
  const jsonLd = s.disponible && s.precio
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: s.nombre,
        description: s.seo.description,
        brand: { "@type": "Brand", name: "BREY" },
        offers: {
          "@type": "Offer",
          price: s.precio,
          priceCurrency: "USD",
          availability: checkoutUrl
            ? "https://schema.org/InStock"
            : "https://schema.org/PreOrder",
        },
      }
    : null;

  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      {/* ── Hero ── */}
      <section className={`relative bg-gradient-to-br ${s.color.gradient} border-b border-white/[0.07]`}>
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full ${s.color.glow} blur-[120px]`} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20">
          <div className="flex items-center gap-2 text-[11px] text-white/55 mb-8 font-medium">
            <Link href="/sistemas" className="hover:text-white/90 transition-colors">Sistemas</Link>
            <span>/</span>
            <span className={s.color.accent}>{s.nombre}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {s.disponible ? (
              <Badge variant="success" className="text-[10px] tracking-[0.14em] px-3 py-1.5">
                Disponible
              </Badge>
            ) : (
              <Badge variant="neutral" className="text-[10px] tracking-[0.14em] px-3 py-1.5">
                Disponible próximamente
              </Badge>
            )}
            {s.duracion && (
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border border-white/10 text-white/60">
                {s.duracion}
              </span>
            )}
            {s.niveles.length > 0 && (
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border border-white/10 text-white/60">
                {s.niveles.length} niveles internos
              </span>
            )}
          </div>

          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight mb-5 max-w-3xl">
            {s.nombre}
          </h1>
          <p className={`text-lg sm:text-xl font-medium ${s.color.accent} mb-6`}>
            {s.tagline}
          </p>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-10">
            {s.descripcion}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#acceso"
              className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full ${s.color.cta} text-white font-bold text-sm transition-all duration-200`}
            >
              {s.disponible ? `Entrar al ${s.nombre}` : "Unirme a la lista de espera"}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
            <Link
              href="/diagnostico"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:border-white/20 font-bold text-sm transition-all duration-200"
            >
              Hacer el Diagnóstico primero
            </Link>
          </div>
        </div>
      </section>

      {/* ── Para quién + qué entrega hoy ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-b border-white/[0.05]">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className={`text-[11px] font-bold tracking-[0.20em] uppercase ${s.color.accent} mb-4`}>
              Para quién es
            </p>
            <h2 className="font-black text-3xl sm:text-4xl text-white leading-snug mb-5">
              Este Sistema es exactamente para ti si...
            </h2>
            <p className="text-white/60 leading-relaxed">{s.para}</p>
          </div>
          <div className={`${cardStyles.base} p-7`}>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-5">
              {s.disponible ? "Lo que entrega hoy" : "El ecosistema que acompaña al Sistema"}
            </p>
            <ul className="flex flex-col gap-3">
              {(s.disponible ? s.incluye : s.ecosistema.map((c) => c.etiqueta)).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className={`w-4 h-4 ${s.color.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-sm text-white/60 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Niveles internos: el nivel no es un producto ── */}
      {s.niveles.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-white/[0.05]">
          <div className="text-center mb-12">
            <p className={`text-[11px] font-bold tracking-[0.20em] uppercase ${s.color.accent} mb-4`}>
              Niveles internos
            </p>
            <h2 className="font-black text-3xl sm:text-4xl text-white leading-snug">
              Tu nivel no lo eliges tú.<br />
              <span className="text-white/60">Lo define el Diagnóstico.</span>
            </h2>
            <p className="text-white/55 mt-4 max-w-xl mx-auto leading-relaxed">
              No existe un Sistema aparte para principiantes: cada Sistema contiene la
              progresión completa, y el Diagnóstico BPS determina tu punto de entrada exacto.
            </p>
          </div>

          <div className={`grid sm:grid-cols-2 ${s.niveles.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
            {s.niveles.map((n, i) => (
              <div key={n.nombre} className={`${cardStyles.base} p-6 h-full flex flex-col`}>
                <div className={`w-9 h-9 rounded-full ${s.color.badge} border flex items-center justify-center mb-5`}>
                  <span className={`text-xs font-black ${s.color.accent}`}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-black text-white text-sm mb-3">{n.nombre}</h3>
                <p className="text-white/55 text-xs leading-relaxed flex-1">{n.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Fases (solo Sistemas con contenido publicado) ── */}
      {s.fases.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-white/[0.05]">
          <div className="text-center mb-12">
            <p className={`text-[11px] font-bold tracking-[0.20em] uppercase ${s.color.accent} mb-4`}>
              Estructura del Sistema
            </p>
            <h2 className="font-black text-3xl sm:text-4xl text-white">
              {s.fases.length} fases. {totalSemanas} semanas.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {s.fases.map((fase, i) => (
              <div
                key={fase.nombre}
                className={`${cardStyles.base} ${cardStyles.interactive} p-6`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-9 h-9 rounded-full ${s.color.badge} border flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-xs font-black ${s.color.accent}`}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base text-white leading-snug">{fase.nombre}</h3>
                    <p className="text-[11px] text-white/50 mt-1">
                      {fase.semanas} semanas · {fase.sesionesSemanales}x/semana
                    </p>
                  </div>
                </div>
                <p className="text-white/55 text-sm leading-relaxed">{fase.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── El ecosistema alrededor del Sistema ── */}
      {s.disponible && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-white/[0.05]">
          <div className="text-center mb-12">
            <p className={`text-[11px] font-bold tracking-[0.20em] uppercase ${s.color.accent} mb-4`}>
              Más que entrenamiento
            </p>
            <h2 className="font-black text-3xl sm:text-4xl text-white">
              Compras un Sistema.<br />Entras a un ecosistema.
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {s.ecosistema.map((c) => (
              <div
                key={c.etiqueta}
                className={`p-4 rounded-xl border text-center ${
                  c.estado === "incluido"
                    ? "border-white/[0.08] bg-white/[0.02]"
                    : "border-dashed border-white/[0.10] bg-transparent"
                }`}
              >
                <p className={`text-xs font-bold ${c.estado === "incluido" ? "text-white/75" : "text-white/45"}`}>
                  {c.etiqueta}
                </p>
                <p className={`text-[9px] tracking-[0.14em] uppercase mt-1.5 ${c.estado === "incluido" ? s.color.accent : "text-white/40"}`}>
                  {c.estado === "incluido" ? "Incluido" : "En camino"}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/50 text-xs mt-6">
            Lo marcado “en camino” es visión en desarrollo — tu acceso lo incluye cuando llegue, sin costo adicional.
          </p>
        </section>
      )}

      {/* ── Acceso ── */}
      <section id="acceso" className="relative overflow-hidden border-t border-white/[0.05] scroll-mt-16">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-orange-600/6 blur-[100px] rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 py-24 text-center">
          {s.disponible && s.precioFormato ? (
            <>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-6">
                Acceso completo · {s.precioFormato}
              </p>
              <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white leading-snug mb-6">
                Entra al<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  {s.nombre}
                </span>
              </h2>
              <p className="text-white/55 mb-10 max-w-md mx-auto leading-relaxed">
                {s.tagline} Sistema completo, acceso inmediato y garantía de 30 días.
              </p>
              {checkoutUrl ? (
                <>
                  <CheckoutButton
                    href={checkoutUrl}
                    label={`Acceder ahora — ${s.precioFormato}`}
                  />
                  <p className="text-white/50 text-xs mt-6 tracking-widest uppercase">
                    Acceso inmediato · Garantía 30 días · Sin contratos
                  </p>
                </>
              ) : (
                <div className="max-w-md mx-auto">
                  <LeadCapture
                    source={`sistema-${s.slug}`}
                    title="El acceso abre muy pronto. Déjanos tu email y sé el primero en entrar:"
                    buttonLabel="Avisarme"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-6">
                Disponible próximamente
              </p>
              <h2 className="font-black text-3xl sm:text-4xl md:text-5xl text-white leading-snug mb-6">
                Sé de los primeros<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  en entrar.
                </span>
              </h2>
              <p className="text-white/55 mb-10 max-w-md mx-auto leading-relaxed">
                El {s.nombre} está en construcción — con el mismo rigor que todo el BPS.
                No vendemos lo que aún no existe: déjanos tus datos y te avisamos primero.
              </p>
              <div className="max-w-md mx-auto text-left">
                <WaitlistForm sistemaSlug={s.slug} />
              </div>
            </>
          )}
          <div className="mt-8">
            <Link
              href="/sistemas"
              className="inline-flex items-center justify-center gap-2 text-sm text-white/55 hover:text-white/90 transition-colors"
            >
              Ver todos los Sistemas
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
