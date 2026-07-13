import * as React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ── Textarea del sistema (sobre la primitiva shadcn ui/textarea.tsx) ───────
// Un solo uso hoy (formulario de contacto) → sin prop de forma, a diferencia
// de Input. Si aparece un segundo caso con otra forma, se añade entonces.
// Foco: hereda el ring-ring del primitivo, sin overrides (misma convención).

interface Props extends Omit<React.ComponentProps<"textarea">, "className"> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <ShadcnTextarea
      ref={ref}
      className={cn(
        "rounded-xl bg-white/[0.04] border-white/[0.10] px-4 py-3 text-white placeholder:text-white/50 transition-colors resize-y",
        className
      )}
      {...props}
    />
  );
});

export default Textarea;
