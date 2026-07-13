import * as React from "react";
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// ── Grupo de opciones exclusivas (sobre ui/radio-group.tsx) ────────────────
// Pensado para formularios de preferencia del Dashboard (selección única
// con estado persistente, ej. "objetivo de la semana").
//
// A PROPÓSITO no se usa en las respuestas del Diagnóstico BPS: esas
// tarjetas son un patrón conversacional (clic = avanza de inmediato,
// sin paso de confirmar) distinto del modelo "elegir y luego enviar"
// que RadioGroup representa. Forzarlo ahí cambiaría el mecanismo de
// interacción de un flujo que el fundador ya aprobó explícitamente
// ("nunca como un formulario"). Ver documentación del commit.
//
// El estado marcado ya sale en naranja de marca sin overrides — el
// primitivo usa data-checked:bg-primary y --primary ya es #f97316.
// Foco: ring-ring heredado, sin overrides.

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof ShadcnRadioGroup>,
  React.ComponentProps<typeof ShadcnRadioGroup>
>(function RadioGroup({ className, ...props }, ref) {
  return <ShadcnRadioGroup ref={ref} className={cn("gap-3", className)} {...props} />;
});

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof ShadcnRadioGroupItem>,
  React.ComponentProps<typeof ShadcnRadioGroupItem>
>(function RadioGroupItem({ className, ...props }, ref) {
  return (
    <ShadcnRadioGroupItem
      ref={ref}
      className={cn("border-white/[0.20]", className)}
      {...props}
    />
  );
});

export { RadioGroup, RadioGroupItem };
