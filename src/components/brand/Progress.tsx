import * as React from "react";
import { Progress as ShadcnProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ── Progress del sistema (sobre la primitiva shadcn ui/progress.tsx) ───────
// Usado por la barra superior del Diagnóstico BPS.
//
// El relleno ya sale en naranja de marca sin overrides: --primary
// (#f97316) es el mismo valor exacto que orange-500 del hand-rolled
// original. Se ajustan solo grosor, forma y transición al patrón de la
// barra sticky original: h-0.5 (2px — un indicador discreto sobre la
// conversación, no una barra protagonista; el h-1 del primitivo es el
// doble de grueso), sin bordes redondeados (ocupa el ancho completo de
// su contenedor sticky, de borde a borde) y duration-500 explícito en
// el indicador vía selector descendiente — transition-all por sí solo
// trae los 150ms por defecto de Tailwind, más rápido que el resto de
// transiciones pausadas del sitio (500ms).

interface Props extends Omit<React.ComponentProps<typeof ShadcnProgress>, "className"> {
  className?: string;
}

const Progress = React.forwardRef<React.ElementRef<typeof ShadcnProgress>, Props>(
  function Progress({ className, ...props }, ref) {
    return (
      <ShadcnProgress
        ref={ref}
        className={cn(
          "h-0.5 rounded-none bg-white/[0.05] [&_[data-slot=progress-indicator]]:duration-500",
          className
        )}
        {...props}
      />
    );
  }
);

export default Progress;
