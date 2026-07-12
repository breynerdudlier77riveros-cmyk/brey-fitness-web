import Image from "next/image";
import { founder } from "@/data/founder";
import ScrollReveal from "@/components/ScrollReveal";
import SectionLabel from "@/components/layout/SectionLabel";
import Button from "@/components/ui/Button";
import { cardStyles } from "@/components/ui/Card";
import { ArrowRight } from "@/components/ui/icons";

// ── Acto 6 · Fundador ───────────────────────────────────────────────────────
// Responde: ¿por qué confiar en BREY?
// Todo el contenido viene de src/data/founder.ts — solo datos verdaderos.
// Las tarjetas vacías (p. ej. certificaciones) se ocultan solas.

export default function FounderSection() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <ScrollReveal>
          <SectionLabel>Conoce al fundador</SectionLabel>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-14 items-start">

          {/* Retrato + identidad */}
          <ScrollReveal>
            <div className="max-w-[300px] mx-auto lg:mx-0">
              {founder.fotoPerfil ? (
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/[0.08]">
                  <Image
                    src={founder.fotoPerfil.src}
                    alt={founder.fotoPerfil.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 300px"
                    className="object-cover"
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
              <h3 className="font-black text-2xl text-white mt-6 text-center lg:text-left">
                {founder.nombre}
              </h3>
              <p className="text-white/55 text-sm mt-1.5 text-center lg:text-left leading-relaxed">
                {founder.titulo}
              </p>
            </div>
          </ScrollReveal>

          {/* Manifiesto personal + credenciales */}
          <div>
            <ScrollReveal>
              <blockquote className="relative mb-10">
                <div aria-hidden className="absolute -left-4 md:-left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-400/60 to-transparent" />
                <p className="text-white/75 text-lg md:text-xl leading-[1.8] font-light">
                  “{founder.manifiesto}”
                </p>
              </blockquote>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {founder.credenciales.map((c, i) => (
                <ScrollReveal key={c.titulo} delay={i * 70}>
                  <div className={`${cardStyles.base} p-6 h-full`}>
                    <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-orange-400 mb-4">
                      {c.titulo}
                    </p>
                    {c.titulo === "Especialidades" ? (
                      <div className="flex flex-wrap gap-2">
                        {c.items.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1.5 rounded-full border border-white/[0.10] text-xs font-semibold text-white/70"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <ul className="flex flex-col gap-2.5">
                        {c.items.map((item) => (
                          <li key={item} className="text-sm text-white/60 leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </ScrollReveal>
              ))}

              {/* Certificaciones — aparece sola cuando existan reales */}
              {founder.certificaciones.length > 0 && (
                <ScrollReveal delay={4 * 70}>
                  <div className={`${cardStyles.base} p-6 h-full`}>
                    <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-orange-400 mb-4">
                      Certificaciones
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {founder.certificaciones.map((cert) => (
                        <li key={cert} className="text-sm text-white/60 leading-relaxed">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}
            </div>

            <ScrollReveal>
              <Button href="/historia" variant="outline" size="md">
                Conoce mi historia
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Button>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
