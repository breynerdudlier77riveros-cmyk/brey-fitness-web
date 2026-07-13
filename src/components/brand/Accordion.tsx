import * as React from "react";
import {
  Accordion as ShadcnAccordion,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger as ShadcnAccordionTrigger,
  AccordionContent as ShadcnAccordionContent,
} from "@/components/ui/accordion";
import { Plus } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

// ── Accordion del sistema (sobre la primitiva shadcn ui/accordion.tsx) ─────
// Sin call site — /faq YA es un acordeón, pero con <details>/<summary>
// nativo del navegador, no con este primitivo. Decisión deliberada: NO se
// migra esa página. <details> ahí es semánticamente correcto (ARIA
// automático del navegador), funciona sin JavaScript, y convertirlo a
// Radix obligaría a volver "use client" una página que hoy es 100%
// servidor — un costo real de arquitectura a cambio de nada que /faq
// necesite (no requiere abrir varias preguntas coordinadas ni animación
// más allá de la rotación del ícono, que <details> ya tiene). Mismo
// criterio que RadioGroup con las tarjetas del Diagnóstico: no forzar un
// primitivo donde el patrón nativo ya es correcto.
//
// Este wrapper queda listo para el Dashboard (secciones expandibles de
// progreso, ayuda contextual) replicando el look exacto de /faq: tarjetas
// redondeadas con borde, separadas por gap (no el divisor de línea fina
// por defecto de shadcn), y el mismo ícono "+" que rota 45° a "×" al
// abrir — no el par de chevrons que trae el primitivo. Foco: ring-ring
// heredado, sin overrides.

const Accordion = React.forwardRef<
  React.ElementRef<typeof ShadcnAccordion>,
  React.ComponentProps<typeof ShadcnAccordion>
>(function Accordion({ className, ...props }, ref) {
  return <ShadcnAccordion ref={ref} className={cn("gap-3", className)} {...props} />;
});

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof ShadcnAccordionItem>,
  React.ComponentProps<typeof ShadcnAccordionItem>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <ShadcnAccordionItem
      ref={ref}
      className={cn(
        // not-last:border-b-0 (no border-b-0 a secas): el primitivo trae
        // el divisor con ese modificador exacto — mismo problema que
        // data-[size=default]:h-8 en Select, misma solución.
        "not-last:border-b-0 rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-200 data-open:bg-white/[0.04] data-open:border-white/[0.12]",
        className
      )}
      {...props}
    />
  );
});

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof ShadcnAccordionTrigger>,
  React.ComponentProps<typeof ShadcnAccordionTrigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <ShadcnAccordionTrigger
      ref={ref}
      className={cn(
        // Los dos chevron de shadcn vienen hardcodeados DENTRO de
        // ShadcnAccordionTrigger, después de {children} — no son parte de
        // lo que le paso como hijos, así que no puedo simplemente omitirlos.
        // Se ocultan por su data-slot compartido (nunca por [&_svg], eso
        // ocultaría también el Plus propio) y se añade Plus como hijo real.
        "rounded-none py-0 px-5 font-bold text-white/80 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden",
        className
      )}
      {...props}
    >
      <span className="flex-1 py-5 leading-snug">{children}</span>
      <Plus
        className="w-4 h-4 text-white/55 flex-shrink-0 mt-5 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45"
        strokeWidth={2}
      />
    </ShadcnAccordionTrigger>
  );
});

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof ShadcnAccordionContent>,
  React.ComponentProps<typeof ShadcnAccordionContent>
>(function AccordionContent({ className, ...props }, ref) {
  return (
    <ShadcnAccordionContent
      ref={ref}
      className={cn("px-5 pb-5 pt-0 text-white/60", className)}
      {...props}
    />
  );
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
