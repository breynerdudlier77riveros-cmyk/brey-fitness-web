import * as React from "react";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle as ShadcnCardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter as ShadcnCardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── Tarjeta del sistema (sobre la primitiva shadcn ui/card.tsx) ────────────
//
// cardStyles: SIN CAMBIOS DE VALOR — se confirma alineado con los tokens
// de marca sin tocar nada. bg-white/[0.02] ya es exactamente el mismo
// valor que --card (fijado en la instalación base de shadcn); border y
// rounded-2xl siempre fueron decisiones propias, no derivadas del
// primitivo. Sigue siendo la vía real que usan las 8 páginas del sitio,
// que mezclan la superficie de tarjeta en su propio <Link>/<div> — nunca
// como componente <Card> (cero usos antes de esta migración).
// interactive: elevación 6px + escala 1.02 (BREY v2.1), en CSS puro por la
// misma razón que Button — cardStyles se consume como string plano en más
// de 10 archivos (Link/div propios), nunca a través de un componente React;
// envolver eso en Motion obligaría a convertir cada call site a Client
// Component. -translate-y-1.5 es exactamente 6px en la escala de Tailwind.
export const cardStyles = {
  base: "rounded-2xl border border-white/[0.07] bg-white/[0.02]",
  interactive:
    "hover:border-white/[0.14] hover:bg-white/[0.04] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
} as const;

// Familia Card/Header/Title/Description/Action/Content/Footer: sin call
// site hoy — lista para el Dashboard (tarjeta de sesión, resumen de
// progreso), donde la composición rígida de shadcn sí encaja mejor que
// cardStyles suelto. Solo se corrige lo que rompe la identidad visual:
// ring-foreground/10 (box-shadow) → border real, igual que en Dialog;
// rounded-xl → rounded-2xl para calzar con cardStyles; Title sin peso
// medio. El ritmo vertical (--card-spacing) y el resto se dejan tal cual
// trae el primitivo — sin caso de uso real todavía que valide un ajuste
// distinto. Foco: ring-ring heredado en los controles internos, sin
// overrides.

interface CardProps extends React.ComponentProps<typeof ShadcnCard> {
  /** Mismo hover que cardStyles.interactive — para tarjetas clicables. */
  interactive?: boolean;
}

const Card = React.forwardRef<React.ElementRef<typeof ShadcnCard>, CardProps>(
  function Card({ className, interactive = false, ...props }, ref) {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          "ring-0 rounded-2xl border border-white/[0.07]",
          interactive && cardStyles.interactive,
          className
        )}
        {...props}
      />
    );
  }
);

const CardTitle = React.forwardRef<
  React.ElementRef<typeof ShadcnCardTitle>,
  React.ComponentProps<typeof ShadcnCardTitle>
>(function CardTitle({ className, ...props }, ref) {
  return <ShadcnCardTitle ref={ref} className={cn("font-black", className)} {...props} />;
});

const CardFooter = React.forwardRef<
  React.ElementRef<typeof ShadcnCardFooter>,
  React.ComponentProps<typeof ShadcnCardFooter>
>(function CardFooter({ className, ...props }, ref) {
  return (
    <ShadcnCardFooter
      ref={ref}
      className={cn("border-white/[0.07] bg-white/[0.02]", className)}
      {...props}
    />
  );
});

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter };
