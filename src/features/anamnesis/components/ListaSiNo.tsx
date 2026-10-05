"use client";

import Input from "@/components/brand/Input";

interface Item {
  clave: string;
  etiqueta: string;
  /** Si viene, se dibuja un campo de texto libre junto al Sí/No (ej. "¿para qué?"). */
  conDetalle?: string;
}

interface Props {
  id: string;
  titulo: string;
  descripcion?: string;
  items: Item[];
  datos: Record<string, string>;
  onChange: (clave: string, valor: string) => void;
}

/**
 * Lista compacta de preguntas Sí/No (PAR-Q, cuestionario AHA/ACSM). Radios
 * nativos a propósito: muchas filas cortas no necesitan el primitivo Radix
 * de marca, y un `<input>` plano imprime su estado marcado sin más CSS.
 */
export default function ListaSiNo({ id, titulo, descripcion, items, datos, onChange }: Props) {
  return (
    <section data-seccion={id} className="break-inside-avoid-page">
      {titulo ? <h2 className="text-lg font-black text-white mb-1.5">{titulo}</h2> : null}
      {descripcion ? <p className="text-sm text-white/50 mb-4">{descripcion}</p> : null}
      <div>
        {items.map((item) => (
          <div
            key={item.clave}
            data-fila={item.clave}
            className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-white/[0.06]"
          >
            <p className="text-sm text-white/75 flex-1 min-w-[14rem]">{item.etiqueta}</p>
            {item.conDetalle ? (
              <Input
                value={datos[item.conDetalle] ?? ""}
                onChange={(e) => onChange(item.conDetalle!, e.target.value)}
                placeholder="¿Cuál?"
                className="h-8 py-1 text-sm max-w-[12rem]"
              />
            ) : null}
            <div className="flex gap-4 shrink-0">
              <label className="flex items-center gap-1.5 text-sm text-white/70">
                <input
                  type="radio"
                  name={item.clave}
                  value="si"
                  checked={(datos[item.clave] ?? "") === "si"}
                  onChange={() => onChange(item.clave, "si")}
                  className="accent-orange-500 w-4 h-4 cursor-pointer"
                />
                Sí
              </label>
              <label className="flex items-center gap-1.5 text-sm text-white/70">
                <input
                  type="radio"
                  name={item.clave}
                  value="no"
                  checked={(datos[item.clave] ?? "") === "no"}
                  onChange={() => onChange(item.clave, "no")}
                  className="accent-orange-500 w-4 h-4 cursor-pointer"
                />
                No
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
