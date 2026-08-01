import type { PuntoSerie } from "@/lib/bcs/reporte";
import { formatearFechaCorta } from "./formato";

// ── Gráfico de línea con área (BCS Sprint 2.0) ─────────────────────────────
// SVG a mano: no hay librería de charting instalada y este sprint prohíbe
// añadir una. Sustituye al TrendChart anterior añadiendo rejilla, eje Y con
// tres referencias, relleno de área bajo la línea y hover.
//
// El hover usa <title> nativo de SVG en vez de estado de React: se comporta
// como un tooltip del navegador, no obliga a convertir esto en Client
// Component, y sobrevive a la impresión (un tooltip con JS no imprimiría
// nada). Accesible por el mismo motivo, más la tabla sr-only.

interface Props {
  puntos: PuntoSerie[];
  unidad: string;
  etiqueta: string;
}

const ANCHO = 420;
const ALTO = 150;
const PAD_X = 8;
const PAD_TOP = 14;
const PAD_BOTTOM = 22;

export default function LineChart({ puntos, unidad, etiqueta }: Props) {
  if (puntos.length < 2) return null;

  const valores = puntos.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  // Un margen del 8 % evita que la línea toque los bordes cuando la serie es
  // plana o casi plana (rango 0 → división por cero).
  const rango = max - min || Math.abs(max) * 0.1 || 1;
  const techo = max + rango * 0.08;
  const piso = min - rango * 0.08;

  const x = (i: number) => PAD_X + (i / (puntos.length - 1)) * (ANCHO - PAD_X * 2);
  const y = (v: number) => PAD_TOP + (1 - (v - piso) / (techo - piso)) * (ALTO - PAD_TOP - PAD_BOTTOM);

  const coords = puntos.map((p, i) => ({ ...p, cx: x(i), cy: y(p.valor) }));
  const linea = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.cx.toFixed(1)} ${c.cy.toFixed(1)}`).join(" ");
  const area = `${linea} L ${coords[coords.length - 1].cx.toFixed(1)} ${ALTO - PAD_BOTTOM} L ${coords[0].cx.toFixed(1)} ${ALTO - PAD_BOTTOM} Z`;

  const referencias = [max, (max + min) / 2, min];
  const idGradiente = `grad-${etiqueta.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`Evolución de ${etiqueta} en ${unidad}: de ${valores[0]} a ${valores[valores.length - 1]} a lo largo de ${puntos.length} mediciones`}
      >
        <defs>
          <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:var(--color-orange-400)]" stopOpacity="0.22" />
            <stop offset="100%" className="[stop-color:var(--color-orange-400)]" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Rejilla horizontal — tres referencias, nunca más: es un informe,
            no un osciloscopio. */}
        {referencias.map((valor) => (
          <g key={valor}>
            <line
              x1={PAD_X}
              x2={ANCHO - PAD_X}
              y1={y(valor)}
              y2={y(valor)}
              className="stroke-white/[0.08]"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <text x={PAD_X} y={y(valor) - 4} className="fill-white/35 text-[9px]">
              {valor.toFixed(1)}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#${idGradiente})`} />
        <path
          d={linea}
          fill="none"
          className="stroke-orange-400"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((c) => (
          <g key={c.fecha}>
            <circle cx={c.cx} cy={c.cy} r={3} className="fill-orange-400" />
            {/* Área de captura generosa para el hover, invisible. */}
            <circle cx={c.cx} cy={c.cy} r={12} fill="transparent">
              <title>{`${formatearFechaCorta(c.fecha)}: ${c.valor} ${unidad}`}</title>
            </circle>
          </g>
        ))}
      </svg>

      <figcaption className="flex justify-between mt-1.5 text-[10px] text-white/35">
        <span>{formatearFechaCorta(coords[0].fecha)}</span>
        <span className="text-white/45 font-semibold">{unidad}</span>
        <span>{formatearFechaCorta(coords[coords.length - 1].fecha)}</span>
      </figcaption>

      {/* El lector de pantalla nunca depende del SVG. */}
      <table className="sr-only">
        <caption>{`${etiqueta} — serie completa en ${unidad}`}</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {puntos.map((p) => (
            <tr key={p.fecha}>
              <td>{p.fecha}</td>
              <td>
                {p.valor} {unidad}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
