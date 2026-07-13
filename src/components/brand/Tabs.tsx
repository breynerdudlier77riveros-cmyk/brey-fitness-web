import * as React from "react";
import {
  Tabs,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ── Tabs del sistema (sobre la primitiva shadcn ui/tabs.tsx) ───────────────
// Call site real: el selector de calculadora en /calculadoras (antes un
// array de botones + useState manual, comentado literalmente "Tab bar" en
// el código). La migración reemplaza el estado manual por Radix: teclas
// de flecha entre pestañas, roles ARIA tablist/tab correctos, y el
// contenido inactivo deja de montarse — mismo comportamiento que el
// `{active === id && <Calc/>}` de antes, ahora resuelto por el primitivo.
//
// El look por defecto de shadcn es un "segmented control" compacto (h-8,
// fondo gris, mini-pills) — muy distinto de las tarjetas grandes con
// ícono+etiqueta+subtítulo del selector actual. TabsList/TabsTrigger se
// reescriben casi por completo para preservar exactamente ese look; Tabs
// y TabsContent se re-exportan sin cambios (el primero es solo layout de
// flex, el segundo ya es un panel neutro). Foco: ring-ring heredado, sin
// overrides.

const TabsList = React.forwardRef<
  React.ElementRef<typeof ShadcnTabsList>,
  React.ComponentProps<typeof ShadcnTabsList>
>(function TabsList({ className, ...props }, ref) {
  return (
    <ShadcnTabsList
      ref={ref}
      className={cn(
        // group-data-horizontal/tabs:h-auto (no h-auto a secas): el
        // primitivo fija la altura con ese mismo modificador exacto
        // (group-data-horizontal/tabs:h-8) — mismo problema que el
        // data-[size=default]:h-8 de Select, misma solución: igualar el
        // modificador para que cn()/tailwind-merge cancele el conflicto.
        "group-data-horizontal/tabs:h-auto w-full justify-start rounded-none bg-transparent p-0 gap-2 overflow-x-auto",
        className
      )}
      {...props}
    />
  );
});

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof ShadcnTabsTrigger>,
  React.ComponentProps<typeof ShadcnTabsTrigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <ShadcnTabsTrigger
      ref={ref}
      className={cn(
        "h-auto flex-none flex-col gap-0.5 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-3.5 text-xs font-bold text-white/60 transition-all hover:text-white/90 hover:border-white/10 data-active:border-orange-500/30 data-active:bg-orange-500/[0.08] data-active:text-orange-400 data-active:shadow-none",
        className
      )}
      {...props}
    />
  );
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
