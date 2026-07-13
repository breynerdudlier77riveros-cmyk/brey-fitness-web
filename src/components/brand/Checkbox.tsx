import * as React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ── Checkbox del sistema (sobre la primitiva shadcn ui/checkbox.tsx) ───────
// Sin call site hoy — listo para el Dashboard (ej. preferencias, "acepto
// los términos"). El estado marcado ya sale en naranja de marca sin
// overrides (data-checked:bg-primary + --primary = #f97316, igual que
// RadioGroup). Solo se ajusta el borde sin marcar, más visible que el
// border-input heredado. Sin altura fija que neutralizar esta vez (usa
// size-4 uniforme, no el patrón data-[size=...]:h-* de Select).
// Foco: ring-ring heredado, sin overrides.

const Checkbox = React.forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  React.ComponentProps<typeof ShadcnCheckbox>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <ShadcnCheckbox
      ref={ref}
      className={cn("border-white/[0.20]", className)}
      {...props}
    />
  );
});

export default Checkbox;
