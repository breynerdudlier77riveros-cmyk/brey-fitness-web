"use client";

import { motion, type Variants } from "motion/react";
import { HelpCircle, ChartBar, Flag } from "@/components/brand/icons";

// ── Flujo visual del Diagnóstico BPS (BREY v2.1) ────────────────────────────
// El Diagnóstico pasa de "explicado en un párrafo" a protagonista: se
// muestra la forma de la experiencia (Pregunta → Pregunta → Resultado →
// Sistema recomendado) antes de que el usuario haga clic, no solo se
// describe. Cada paso se revela en cascada al entrar en viewport; la línea
// conectora "crece" entre pasos (scaleX de 0 a 1, no width — evita CLS).

const pasos = [
  { icon: HelpCircle, label: "Pregunta" },
  { icon: HelpCircle, label: "Pregunta" },
  { icon: ChartBar, label: "Resultado" },
  { icon: Flag, label: "Tu Sistema" },
] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const node: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const line: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function DiagnosticoFlow() {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 sm:gap-3 mb-8"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {pasos.map((paso, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3">
          <motion.div variants={node} className="flex flex-col items-center gap-2">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${
                i === pasos.length - 1
                  ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                  : "border-white/[0.10] bg-white/[0.03] text-white/60"
              }`}
            >
              <paso.icon className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <span
              className={`text-[10px] font-bold tracking-[0.10em] uppercase whitespace-nowrap ${
                i === pasos.length - 1 ? "text-orange-400" : "text-white/50"
              }`}
            >
              {paso.label}
            </span>
          </motion.div>

          {i < pasos.length - 1 && (
            <motion.div
              variants={line}
              style={{ transformOrigin: "left" }}
              className="w-5 sm:w-10 h-px bg-white/[0.15] mb-5"
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}
