import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";
import ScrollReveal from "@/components/ScrollReveal";
import SectionLabel from "@/components/layout/SectionLabel";
import SocialLinks from "@/components/SocialLinks";
import { cardStyles } from "@/components/brand/Card";
import { ArrowRight } from "@/components/brand/icons";
import ContactoForm from "./ContactoForm";

export const metadata: Metadata = {
  title: "Contacto — Hablemos",
  description:
    "Escríbenos: soporte, preguntas sobre los Sistemas o sobre el Brey Performance System. Respondemos en 24–48 horas hábiles.",
};

const preguntasRapidas = [
  {
    q: "¿Tienes dudas antes de empezar?",
    a: "Las respuestas a lo más frecuente están en un solo lugar.",
    href: "/faq",
    label: "Preguntas frecuentes",
  },
  {
    q: "¿Quieres una devolución?",
    a: "Garantía de 30 días, sin preguntas. El proceso completo, aquí.",
    href: "/reembolsos",
    label: "Política de reembolsos",
  },
  {
    q: "¿No sabes qué sistema es para ti?",
    a: "El diagnóstico te lo dice en 2 minutos — con su porqué.",
    href: "/diagnostico",
    label: "Diagnóstico BPS",
  },
];

export default function ContactoPage() {
  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">
      <section className="relative border-b border-white/[0.05]">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/3 w-[500px] h-[300px] bg-orange-600/6 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-20 md:pb-24">
          <SectionLabel>Contacto</SectionLabel>

          <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">

            {/* Información */}
            <div>
              <h1 className="font-black text-4xl sm:text-5xl text-white leading-[1.1] tracking-tight mb-5">
                Hablemos.
              </h1>
              <p className="text-white/60 leading-relaxed max-w-md mb-10">
                Soporte, preguntas sobre un sistema, prensa o colaboraciones — este es el canal.
                Detrás no hay un bot: responde el equipo.
              </p>

              <div className="flex flex-col gap-6 mb-10">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-orange-400 mb-2">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-white/80 hover:text-white font-bold text-lg transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-orange-400 mb-2">
                    Tiempo de respuesta
                  </p>
                  <p className="text-white/60 text-sm">24–48 horas hábiles.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-orange-400 mb-3">
                    Redes
                  </p>
                  <SocialLinks />
                </div>
              </div>

              {/* Respuestas rápidas */}
              <div className="flex flex-col gap-3">
                {preguntasRapidas.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`${cardStyles.base} ${cardStyles.interactive} group p-5 flex items-center justify-between gap-4`}
                  >
                    <div>
                      <p className="font-bold text-sm text-white/85">{p.q}</p>
                      <p className="text-xs text-white/50 mt-1 leading-relaxed">{p.a}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white/55 group-hover:text-orange-400 transition-colors flex-shrink-0">
                      {p.label}
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Slot futuro: mapa / dirección física cuando exista sede.
                  Se añade aquí sin tocar el resto del layout. */}
            </div>

            {/* Formulario */}
            <ScrollReveal>
              <div className={`${cardStyles.base} p-7 md:p-9`}>
                <h2 className="font-black text-xl text-white mb-6">Envíanos un mensaje</h2>
                <ContactoForm emailDirecto={CONTACT_EMAIL} />
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </main>
  );
}
