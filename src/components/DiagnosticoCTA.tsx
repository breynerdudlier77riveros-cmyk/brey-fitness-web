import Button from "@/components/brand/Button";
import { ArrowRight } from "@/components/brand/icons";
import DiagnosticoFlow from "@/components/DiagnosticoFlow";

// ── CTA "Encuentra tu Camino" — compartido entre home y /sistemas ──────────
// Antes duplicado casi verbatim en ambas páginas (BREY v3.0, hallazgo de
// auditoría). variant="home" añade el flujo visual del Diagnóstico y un
// título más grande; variant="sistemas" añade la línea "2 minutos · Sin
// registro · Gratis" que la home no necesita repetir.

interface Props {
  variant: "home" | "sistemas";
  className?: string;
}

export default function DiagnosticoCTA({ variant, className = "" }: Props) {
  const isHome = variant === "home";
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-orange-500/25 bg-orange-500/[0.05] p-8 md:p-12 text-center ${className}`}
    >
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-orange-600/10 blur-[80px] rounded-full pointer-events-none"
      />
      <div className="relative">
        <h2 className={`font-black text-3xl sm:text-4xl ${isHome ? "md:text-5xl" : ""} text-white mb-4`}>
          Encuentra tu Camino
        </h2>
        <p className={`text-white/60 leading-relaxed max-w-lg mx-auto ${isHome ? "mb-10" : "mb-8"}`}>
          No necesitas adivinar qué Sistema elegir. El Diagnóstico BPS analiza tus
          objetivos, experiencia y disponibilidad para recomendarte el Sistema — y el
          nivel — más adecuado para ti.
        </p>
        {isHome && <DiagnosticoFlow />}
        <Button href="/diagnostico" size="lg">
          Iniciar Diagnóstico BPS
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </Button>
        {!isHome && (
          <p className="text-white/40 text-[11px] tracking-[0.18em] uppercase mt-5">
            2 minutos · Sin registro · Gratis
          </p>
        )}
      </div>
    </div>
  );
}
