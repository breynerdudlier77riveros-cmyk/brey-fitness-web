// ── Las 5 etiquetas de procedencia del BCS Handbook (00) ────────────────────
// "Nunca se mezclan dos en la misma afirmación" — cada variable lleva
// exactamente una. El emoji + texto completo van siempre juntos (nunca solo
// el emoji): Accesibilidad (BCS Design Handbook 15) exige texto alternativo
// del nombre completo, no solo el glifo.

import type { Procedencia } from "@/lib/bcs/reporte";

export const PROCEDENCIA_INFO: Record<Procedencia, { emoji: string; etiqueta: string; badgeVariant: "crudo" | "derivado" | "fabricante" | "validacion" | "producto" }> = {
  crudo: { emoji: "📟", etiqueta: "Dato crudo", badgeVariant: "crudo" },
  derivado: { emoji: "🧮", etiqueta: "Derivado", badgeVariant: "derivado" },
  fabricante: { emoji: "🏭", etiqueta: "Depende del fabricante", badgeVariant: "fabricante" },
  validacion: { emoji: "🔬", etiqueta: "Pendiente de validación científica", badgeVariant: "validacion" },
  producto: { emoji: "🟠", etiqueta: "Decisión de producto BREY", badgeVariant: "producto" },
};
