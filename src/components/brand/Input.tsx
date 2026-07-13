import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Input del sistema (sobre la primitiva shadcn ui/input.tsx) ─────────────
// shape="field" (rounded-xl) → formularios apilados: Contacto, Waitlist.
// shape="pill"  (rounded-full) → fila junto a un botón: LeadCapture.
//
// h-auto neutraliza la altura fija del primitivo, igual que en Button.
// A propósito NO se fija text-sm: el primitivo trae text-base md:text-sm
// (16px en móvil, 14px en escritorio) — evita el zoom automático de
// Safari iOS al enfocar un input. El foco lo aporta siempre ui/input.tsx
// (focus-visible:ring-ring) — ver convención de foco en brand/Button.tsx.

type Shape = "field" | "pill";

const shapes: Record<Shape, string> = {
  field: "rounded-xl",
  pill: "rounded-full",
};

interface Props extends Omit<React.ComponentProps<"input">, "className"> {
  className?: string;
  shape?: Shape;
}

const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className, shape = "field", ...props },
  ref
) {
  return (
    <ShadcnInput
      ref={ref}
      className={cn(
        "h-auto bg-white/[0.04] border-white/[0.10] px-4 py-3 text-white placeholder:text-white/50 transition-colors",
        shapes[shape],
        className
      )}
      {...props}
    />
  );
});

export default Input;
