"use client";

import { cn } from "@/lib/utils";

// ── Select nativo con el desplegable legible (Sprint MAC-2) ────────────────
//
// EL FALLO QUE ESTE COMPONENTE EXISTE PARA IMPEDIR, Y QUE YA HABÍA PASADO
// TRES VECES:
//
//   Un `<select>` con fondo translúcido —`bg-white/[0.03]`— y texto blanco se
//   ve perfecto cerrado. Al abrirlo, el sistema operativo pinta SU panel, que
//   en Windows es blanco, y hereda el `color: white` del control. Resultado:
//   una lista de opciones en blanco sobre blanco, invisibles.
//
//   No es un fallo de CSS que se note al escribirlo: el desarrollador que lo
//   escribe suele estar en un tema oscuro donde el panel sale oscuro por otras
//   razones, y el control cerrado se ve bien en todas partes.
//
// LAS DOS COSAS QUE LO ARREGLAN, Y HACEN FALTA LAS DOS:
//
//   · `[color-scheme:dark]` — le dice al navegador que pinte los controles
//     nativos en oscuro, incluido el panel desplegable.
//   · Un FONDO OPACO (`bg-slate-900`, no `bg-white/x`) — porque un fondo
//     translúcido deja que se vea lo que hay detrás, y detrás del panel
//     nativo no hay página: hay el blanco del sistema.
//
// Por eso esto es un componente y no una constante de clases: una constante
// se puede no importar, y el `<select>` que se escriba a mano volverá a
// olvidarlo. `select-nativo.test.ts` comprueba que ningún `<select>` del
// proyecto se quede sin el tratamiento.
//
// ── POR QUÉ NATIVO Y NO EL `Select` DE RADIX ─────────────────────────────
//
//   `components/brand/Select.tsx` monta su propio panel en la página y no
//   tiene este problema, pero su API es una lista plana de cadenas donde el
//   valor Y la etiqueta son lo mismo. Aquí hacen falta pares —el id de un
//   atleta con su nombre— y, en los filtros, un `name` que el formulario
//   envíe de verdad, que un componente de Radix no hace sin un campo oculto.

export interface OpcionSelect {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: readonly OpcionSelect[];
  /** Primera opción, para el estado «sin elegir». */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

/**
 * Las clases que hacen legible el desplegable.
 *
 * Exportadas para el `<select>` que no pueda usar este componente —uno no
 * controlado con `defaultValue` dentro de un formulario, por ejemplo—. Que
 * existan aquí y no copiadas en cada fichero es lo que permite corregirlas
 * en un solo sitio.
 */
export const CLASES_SELECT =
  "h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white " +
  "outline-none transition-colors focus:border-orange-500/40 disabled:opacity-50 " +
  "[color-scheme:dark]";

export default function SelectNativo({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className,
  id,
  name,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <select
      id={id}
      name={name}
      aria-label={ariaLabel}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(CLASES_SELECT, className)}
    >
      {/* El fondo también en cada `<option>`: hay navegadores que no propagan
          el `color-scheme` del control a sus hijos, y el cinturón es barato. */}
      {placeholder !== undefined ? (
        <option value="" className="bg-slate-900 text-white">
          {placeholder}
        </option>
      ) : null}
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-slate-900 text-white">
          {o.label}
        </option>
      ))}
    </select>
  );
}
