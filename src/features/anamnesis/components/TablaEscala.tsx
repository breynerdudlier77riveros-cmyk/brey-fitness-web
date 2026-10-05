"use client";

interface Opcion {
  valor: string;
  etiqueta: string;
}

interface Props {
  tituloSeccion: string;
  descripcion?: string;
  prefijoClave: string;
  items: { id: number; texto: string }[];
  opciones: Opcion[];
  datos: Record<string, string>;
  onChange: (clave: string, valor: string) => void;
}

/**
 * Tabla de pregunta + escala horizontal de opciones fijas. Mismo componente
 * para el cuestionario de 37 motivos (escala 1–10) y la escala de estrés
 * percibido PSS-14 (escala Nunca…Muy a menudo): ambos son "una fila, N
 * columnas de opción única", solo cambian las etiquetas de la escala.
 */
export default function TablaEscala({
  tituloSeccion,
  descripcion,
  prefijoClave,
  items,
  opciones,
  datos,
  onChange,
}: Props) {
  return (
    <section data-seccion={prefijoClave} className="break-inside-avoid-page">
      <h2 className="text-lg font-black text-white mb-1.5">{tituloSeccion}</h2>
      {descripcion ? <p className="text-sm text-white/50 mb-4">{descripcion}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-white/45 border-b border-white/10">
              <th className="py-2 pr-2 font-semibold">#</th>
              <th className="py-2 pr-4 font-semibold">Pregunta</th>
              {opciones.map((o) => (
                <th key={o.valor} className="py-2 px-1.5 font-semibold text-center whitespace-nowrap">
                  {o.etiqueta}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const clave = `${prefijoClave}.${item.id}`;
              return (
                <tr key={item.id} className="border-b border-white/[0.06]" data-fila={item.id}>
                  <td className="py-1.5 pr-2 text-white/40 align-top">{item.id}</td>
                  <td className="py-1.5 pr-4 text-white/80 align-top">{item.texto}</td>
                  {/* Radios nativos a propósito: una celda <td> por opción no
                      admite el <div role="radiogroup"> que envuelve el
                      primitivo de marca (ver RadioGroup.tsx) sin romper la
                      fila. `name` agrupa la selección exclusiva por fila. */}
                  {opciones.map((o) => (
                    <td key={o.valor} className="py-1.5 px-1.5 text-center align-top">
                      <input
                        type="radio"
                        name={clave}
                        value={o.valor}
                        checked={(datos[clave] ?? "") === o.valor}
                        onChange={() => onChange(clave, o.valor)}
                        aria-label={`${o.etiqueta} — pregunta ${item.id}`}
                        className="accent-orange-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
