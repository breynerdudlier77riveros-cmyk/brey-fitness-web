import type { Metadata } from "next";
import Image from "next/image";
import { founder } from "@/data/founder";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ScrollReveal";
import SectionLabel from "@/components/layout/SectionLabel";

export const metadata: Metadata = {
  title: "Historia — Quién está detrás del sistema",
  description:
    "La historia real detrás del Brey Performance System: calistenia, Street Workout, educación física y la obsesión por entrenar con criterio y evidencia.",
};

export default function HistoriaPage() {
  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative border-b border-white/[0.05]">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] bg-orange-600/7 blur-[130px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
          <SectionLabel>La historia</SectionLabel>
          <div className="grid md:grid-cols-[1fr_280px] gap-10 items-center">
            <div>
              <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight mb-6">
                Quién está detrás<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  del sistema.
                </span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-xl mb-4">{founder.intro}</p>
              <p className="text-white/55 text-sm">
                {founder.nombre} · {founder.titulo} · {founder.ubicacion}
              </p>
            </div>
            <ScrollReveal>
              {founder.fotoPerfil ? (
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/[0.08]">
                  <Image
                    src={founder.fotoPerfil.src}
                    alt={founder.fotoPerfil.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                /* Monograma mientras llega la fotografía profesional */
                <div className="relative aspect-[3/4] rounded-3xl border border-white/[0.08] bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 flex items-center justify-center">
                  <span aria-hidden className="font-black text-7xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-500">
                    BR
                  </span>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Bio + fotos intercaladas ── */}
      <section className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-10">
          {founder.bio.map((parrafo, i) => (
            <ScrollReveal key={i}>
              <p className="text-white/55 leading-[1.9] text-base md:text-lg">{parrafo}</p>
              {founder.fotos[i] && (
                <figure className="mt-10">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.07]">
                    <Image
                      src={founder.fotos[i].src}
                      alt={founder.fotos[i].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-[11px] text-white/50 mt-3 tracking-[0.15em] uppercase">
                    {founder.fotos[i].caption}
                  </figcaption>
                </figure>
              )}
            </ScrollReveal>
          ))}
        </div>

        {/* Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-3 gap-4 mt-16">
            {founder.stats.map((s) => (
              <div key={s.label} className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center">
                <p className="font-black text-2xl md:text-3xl text-orange-400">{s.value}</p>
                <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-white/55 mt-2 leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Cierre + CTA ── */}
      <section className="relative overflow-hidden border-t border-white/[0.05]">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-orange-600/6 blur-[100px] rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 py-20 md:py-32 text-center">
          <p className="text-white/50 text-lg md:text-xl leading-relaxed italic mb-10">
            “{founder.cierre}”
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/bps" size="lg" className="text-sm">
              Conocer el método BPS
            </Button>
            <Button href="/diagnostico" variant="outline" size="lg" className="text-sm">
              Empezar mi diagnóstico
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}
