import type { Metadata } from "next";
import CalculadorasClient from "./CalculadorasClient";

export const metadata: Metadata = {
  title: "Calculadoras Fitness — 1RM, TDEE, IMC, Macros",
  description:
    "Calculadoras de fitness basadas en fórmulas científicas validadas: 1RM (Brzycki), TDEE (Mifflin-St Jeor), IMC, distribución de macros, frecuencia cardíaca y volumen semanal.",
};

export default function CalculadorasPage() {
  return (
    <main className="bg-slate-950 text-white">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/50 mb-4">
          Herramientas gratuitas
        </p>
        <h1 className="font-black text-4xl sm:text-5xl text-white leading-[1.1] tracking-tight mb-4">
          Calculadoras BPS
        </h1>
        <p className="text-white/60 max-w-lg mx-auto leading-relaxed">
          Herramientas basadas en fórmulas científicas validadas. Sin registro, sin trampa.
        </p>
      </section>

      <CalculadorasClient />
    </main>
  );
}
