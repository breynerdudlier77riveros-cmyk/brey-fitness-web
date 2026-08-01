// ── Gráfico de línea (BCS Design Handbook 11) ──────────────────────────────
// "Línea, tipo dominante en v1." Eje siempre muestra unidad (contraejemplo:
// nunca sin unidad). Acompañado de tabla sr-only con los mismos puntos
// (Accesibilidad 15) — un lector de pantalla nunca depende del SVG.
//
// Sin librería de charting (ninguna está instalada — package.json). SVG a
// mano, mismo criterio que ProgresoChart.tsx (divs) pero con <path> porque
// una serie de tendencia es una curva, no barras discretas.
//
// Deliberadamente NO implementado (umbral no especificado en ningún
// handbook, no se inventa): segmentos punteados para huecos de tiempo
// grandes entre puntos, y marcador distinto para "valor sospechoso" (el
// BCS Handbook 03 menciona la columna pero no da el sub-rango exacto,
// distinto del rango físico válido que sí aplica Postgres). Ver informe.

import type { PuntoSerie } from "@/lib/bcs/reporte";

interface Props {
  puntos: PuntoSerie[];
  unidad: string;
  color?: string; // clase Tailwind de stroke, ej. "stroke-orange-400"
}

const ANCHO = 400;
const ALTO = 120;
const PAD = 24;

function formatearFecha(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es", { day: "2-digit", month: "short" });
}

export default function TrendChart({ puntos, unidad, color = "stroke-orange-400" }: Props) {
  if (puntos.length < 2) return null;

  const valores = puntos.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || 1;

  const coords = puntos.map((p, i) => {
    const x = PAD + (i / (puntos.length - 1)) * (ANCHO - PAD * 2);
    const y = ALTO - PAD - ((p.valor - min) / rango) * (ALTO - PAD * 2);
    return { x, y, ...p };
  });

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="w-full h-auto" role="presentation" aria-hidden="true">
        <text x={PAD} y={14} className="fill-white/40 text-[9px]">
          {max.toFixed(1)} {unidad}
        </text>
        <text x={PAD} y={ALTO - 6} className="fill-white/40 text-[9px]">
          {min.toFixed(1)} {unidad}
        </text>
        <path d={path} fill="none" className={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c) => (
          <circle key={c.fecha} cx={c.x} cy={c.y} r={3} className={color} fill="currentColor" stroke="none" />
        ))}
      </svg>
      <div className="flex justify-between mt-1 text-[10px] text-white/40">
        <span>{formatearFecha(coords[0].fecha)}</span>
        <span>{formatearFecha(coords[coords.length - 1].fecha)}</span>
      </div>

      {/* Tabla accesible — el lector de pantalla nunca depende del SVG. */}
      <table className="sr-only">
        <caption>Serie de tendencia en {unidad}</caption>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Valor</th>
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
    </div>
  );
}
