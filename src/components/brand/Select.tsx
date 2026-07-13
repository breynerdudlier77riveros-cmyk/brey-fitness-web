"use client";

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Select del sistema (sobre la primitiva shadcn ui/select.tsx) ───────────
// API simplificada para el caso de uso actual (lista plana de opciones de
// texto): envuelve Root/Trigger/Value/Content/Item de Radix para que el
// call site quede tan simple como el <select> nativo que reemplaza.
//
// h-auto neutraliza la altura fija del trigger; w-full reemplaza el w-fit
// del primitivo (nuestro trigger ocupa todo el ancho del formulario, como
// el <select> nativo que reemplaza). El panel desplegable y el ítem
// resaltado ya heredan los colores de marca (--popover, --accent) sin
// overrides — quedaron correctos desde la instalación base de shadcn.
// Foco: ring-ring heredado, sin overrides.
//
// Cambio de comportamiento consciente: el <select> nativo anterior abría
// el picker propio del sistema operativo (rueda en iOS, lista en Android)
// y no tenía flecha visible (appearance-none sin reemplazo). Este Select
// abre un panel propio en la página y sí muestra una flecha — mejora de
// affordance, pero ya no delega en la UI nativa del SO.

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

export default function Select({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <ShadcnSelect value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          // data-[size=default]:h-auto (no h-auto a secas) porque el
          // primitivo fija la altura con ese mismo modificador exacto
          // (data-[size=default]:h-8) — cn()/tailwind-merge solo cancela
          // clases con el modificador idéntico, así que sin el prefijo
          // aquí h-8 seguiría ganando el empate de especificidad.
          "data-[size=default]:h-auto w-full rounded-xl bg-white/[0.04] border-white/[0.10] px-4 py-3 text-white transition-colors",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
}
