import * as React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ── Switch del sistema (sobre la primitiva shadcn ui/switch.tsx) ───────────
// Sin call site hoy — listo para el Dashboard (ej. "recordarme por email").
// El track marcado ya sale en naranja de marca sin overrides
// (data-checked:bg-primary + --primary = #f97316). Tamaño sin tocar: no
// hay convención previa de marca que proteger (componente nuevo) y las
// dimensiones del primitivo (18.4×32px) son el estándar universal de un
// toggle — no el mismo caso que Select, donde sí existía un tamaño propio
// a preservar.
//
// Hallazgo real corregido: el thumb del primitivo usa bg-background (casi
// negro en este sitio, porque el tema oscuro vive directo en :root sin
// variante .dark — nunca se activa aquí). Su único color de estado
// "marcado" está detrás de un dark:data-checked:bg-primary-foreground, que
// por lo anterior nunca se aplica: el thumb queda casi negro SIEMPRE,
// marcado o no. Sobre el track sin marcar (gris translúcido tenue) el
// contraste se pierde casi por completo. Se fuerza blanco puro vía
// selector descendiente — el primitivo no expone una prop para el thumb y
// no se edita ui/switch.tsx a mano — el patrón universal "thumb blanco,
// track de color" (iOS, Material) que garantiza contraste en ambos
// estados. Foco: ring-ring heredado, sin overrides.

const Switch = React.forwardRef<
  React.ElementRef<typeof ShadcnSwitch>,
  React.ComponentProps<typeof ShadcnSwitch>
>(function Switch({ className, ...props }, ref) {
  return (
    <ShadcnSwitch
      ref={ref}
      className={cn("[&_[data-slot=switch-thumb]]:bg-white", className)}
      {...props}
    />
  );
});

export default Switch;
