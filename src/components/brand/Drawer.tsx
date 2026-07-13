import * as React from "react";
import {
  Drawer,
  DrawerPortal,
  DrawerTrigger,
  DrawerClose,
  DrawerContent as ShadcnDrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

// ── Drawer del sistema (sobre la primitiva shadcn ui/drawer.tsx, que a su
// vez envuelve la librería vaul) ────────────────────────────────────────────
// Call site real: el menú móvil del Navbar. La versión anterior (un
// useState + {open && <div>} apareciendo debajo de la barra) no tenía
// animación, trampa de foco, cierre con Escape, cierre al tocar fuera ni
// bloqueo de scroll del body — huecos reales que vaul resuelve solo, no un
// primitivo forzado donde el patrón anterior ya bastaba (a diferencia de
// RadioGroup en el Diagnóstico o Accordion en /faq).
//
// El overlay se corrigió directo en ui/drawer.tsx (mismo ajuste que
// Dialog, misma razón: bg-black/10 por defecto es casi invisible en un
// sitio ya oscuro). Aquí solo se ajusta el borde del panel — border-l sin
// color explícito en el primitivo — a border-white/[0.07], el mismo tono
// que usa cada superficie del sitio.

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof ShadcnDrawerContent>,
  React.ComponentProps<typeof ShadcnDrawerContent>
>(function DrawerContent({ className, ...props }, ref) {
  return (
    <ShadcnDrawerContent
      ref={ref}
      // Solo el color: el ancho del borde (border-l/border-r) ya lo trae
      // el primitivo, correctamente condicionado por dirección — el
      // color de Tailwind no necesita el mismo modificador porque cae en
      // las 4 aristas por igual y solo se ve donde ya hay ancho > 0.
      className={cn("border-white/[0.07]", className)}
      {...props}
    />
  );
});

export {
  Drawer,
  DrawerPortal,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
};
