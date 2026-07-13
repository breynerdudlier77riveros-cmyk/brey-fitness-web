import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ── Tooltip del sistema (sobre la primitiva shadcn ui/tooltip.tsx) ─────────
// Sin call site hoy — listo para el Dashboard (explicar RPE/RIR, iconos
// sin texto, etc.).
//
// Sin ajustes de marca: el primitivo invierte el color a propósito
// (bg-foreground text-background — burbuja clara sobre fondo oscuro,
// el mismo truco de Apple/VS Code) para garantizar legibilidad sin
// depender del tema de la página. Es el comportamiento correcto tal
// cual llega, no una omisión.
//
// TooltipProvider se monta una sola vez en app/layout.tsx (envuelve
// toda la app) — Radix lo exige para que cualquier Tooltip funcione,
// sin importar cuántos se usen. Se re-exporta desde aquí para que
// layout.tsx importe siempre desde brand/, nunca directo de ui/.

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
