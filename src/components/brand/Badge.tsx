import * as React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Badge del sistema (sobre la primitiva shadcn ui/badge.tsx) ─────────────
// Dos estados reales y repetidos en el sitio: "success" (Disponible,
// esmeralda) y "neutral" (Disponible próximamente / lista de espera,
// blanco apagado) — los únicos badges genuinamente reutilizables entre
// páginas. El resto de "badges" del sitio (nivel de programa, categoría
// de blog, dificultad de ejercicio) usan color dinámico por ítem desde
// los datos (p.ej. p.color.badge) — no encajan en un enum fijo y siguen
// con sus clases propias, igual que cardStyles para las tarjetas que no
// encajan en <Card>.
//
// Solo el color semántico va en el componente; padding/tamaño de texto/
// tracking se pasan por className en cada call site — los 4 usos
// existentes ya traían variaciones menores entre sí (px-2.5 vs px-3,
// 0.12em vs 0.14em de tracking) y se preservó cada una tal cual estaba,
// sin unificarlas de paso. Foco: ring-ring heredado, sin overrides
// (aunque un badge normal no es focuseable, se hereda por si se usa
// asChild sobre un elemento interactivo).
//
// Variantes de procedencia (BCS Design Handbook 06, componentes heredados):
// las 5 etiquetas obligatorias del BCS Handbook (00) — crudo/derivado/
// fabricante/validación/producto — nunca semánticas (no significan mejora
// ni error, solo el origen del dato). Colores informativos, no los
// success/neutral existentes.

type Variant = "success" | "neutral" | "crudo" | "derivado" | "fabricante" | "validacion" | "producto";

const variants: Record<Variant, string> = {
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  neutral: "border-white/15 bg-white/[0.04] text-white/60",
  crudo: "border-sky-500/25 bg-sky-500/10 text-sky-400",
  derivado: "border-violet-500/25 bg-violet-500/10 text-violet-400",
  fabricante: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  validacion: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-400",
  producto: "border-orange-500/25 bg-orange-500/10 text-orange-400",
};

interface Props extends Omit<React.ComponentProps<typeof ShadcnBadge>, "variant"> {
  variant?: Variant;
}

const Badge = React.forwardRef<React.ElementRef<typeof ShadcnBadge>, Props>(
  function Badge({ className, variant = "neutral", ...props }, ref) {
    return (
      <ShadcnBadge
        ref={ref}
        variant="outline"
        className={cn("h-auto rounded-full font-bold uppercase", variants[variant], className)}
        {...props}
      />
    );
  }
);

export default Badge;
