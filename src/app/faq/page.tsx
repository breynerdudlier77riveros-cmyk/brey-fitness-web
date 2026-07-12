import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/data/faq";
import SectionLabel from "@/components/layout/SectionLabel";
import { ArrowRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description:
    "Respuestas a las dudas más comunes sobre los programas Performance, la garantía de 30 días, el acceso y el método BPS.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };

  return (
    <main className="bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <SectionLabel>Soporte</SectionLabel>
        <h1 className="font-black text-4xl sm:text-5xl text-white mb-4">
          Preguntas frecuentes
        </h1>
        <p className="text-white/55 leading-relaxed mb-14 max-w-lg">
          Todo lo que necesitas saber antes de empezar. ¿No encuentras tu
          respuesta? Escríbenos y la resolvemos.
        </p>

        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <details
              key={f.pregunta}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] open:bg-white/[0.04] open:border-white/[0.12] transition-all duration-200"
            >
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-sm text-white/80 leading-snug">
                  {f.pregunta}
                </span>
                <svg
                  className="w-4 h-4 text-white/55 flex-shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed">
                {f.respuesta}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-14 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center">
          <p className="text-white/50 text-sm mb-4">
            ¿Todavía no sabes qué programa es para ti?
          </p>
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-all"
          >
            Empezar mi diagnóstico
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </main>
  );
}
