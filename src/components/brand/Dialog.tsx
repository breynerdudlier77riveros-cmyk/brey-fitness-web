import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent as ShadcnDialogContent,
  DialogDescription as ShadcnDialogDescription,
  DialogFooter as ShadcnDialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle as ShadcnDialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ── Dialog del sistema (sobre la primitiva shadcn ui/dialog.tsx) ───────────
// Sin call site hoy — listo para el Dashboard (confirmaciones, detalle de
// sesión, etc.).
//
// Root/Trigger/Close/Portal/Header se re-exportan sin cambios: son piezas
// de comportamiento o layout simple, sin color que ajustar.
//
// El overlay (fondo oscurecido detrás del panel) vive hardcodeado DENTRO
// de DialogContent en ui/dialog.tsx — no es una prop inyectable desde
// aquí. Se corrigió directamente en ese archivo (bg-black/70 en vez de
// bg-black/10, ver comentario ahí) — la única excepción intencional a
// "nunca tocar ui/*.tsx" en toda esta migración, por una razón concreta
// y documentada: el 10% por defecto de shadcn asume fondo claro y aquí
// el sitio ya es oscuro de base.
//
// Content: ring-foreground/10 (mecanismo de box-shadow) se reemplaza por
// border-white/[0.08] — el mismo mecanismo de borde real que usa cada
// superficie del sitio (cardStyles.base), no una excepción visual.
// Title: font-medium → font-black, la marca no usa pesos medios en
// títulos, todo h1/h2 del sitio es font-black.
// Footer: bg-muted/50 + border-t sin color → bg-white/[0.02] +
// border-white/[0.07], igual que el resto de las superficies con
// separador.
// Foco: ring-ring heredado en los controles internos (botón de cerrar),
// sin overrides.

const DialogContent = React.forwardRef<
  React.ElementRef<typeof ShadcnDialogContent>,
  React.ComponentProps<typeof ShadcnDialogContent>
>(function DialogContent({ className, ...props }, ref) {
  return (
    <ShadcnDialogContent
      ref={ref}
      className={cn("ring-0 border border-white/[0.08]", className)}
      {...props}
    />
  );
});

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof ShadcnDialogTitle>,
  React.ComponentProps<typeof ShadcnDialogTitle>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <ShadcnDialogTitle
      ref={ref}
      className={cn("font-black text-lg", className)}
      {...props}
    />
  );
});

const DialogDescription = ShadcnDialogDescription;

function DialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof ShadcnDialogFooter>) {
  return (
    <ShadcnDialogFooter
      className={cn("border-white/[0.07] bg-white/[0.02]", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
