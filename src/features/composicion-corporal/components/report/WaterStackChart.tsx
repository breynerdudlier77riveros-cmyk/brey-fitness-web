import type { Medicion } from "@/lib/bcs/tipos";
import { formatearFechaCorta } from "./formato";

// ── Área apilada de agua corporal (BCS Sprint 2.0) ─────────────────────────
// Único uso permitido del apilado en v1 (BCS Design Handbook 11, VIZ-04):
// intracelular + extracelular = total. No se generaliza a otras variables.
//
// Reemplaza al StackedAreaChart anterior añadiendo rejilla, leyenda con
// valores del último punto y hover por punto. Como en LineChart, el hover es
// <title> nativo: sin JS, sobrevive a la impresión.

interface Props {
  /** Ascendente (más antigua primero). */
  historico: Medicion[];
}

interface Punto {
  fecha: string;
  intra: number;
  extra: number;
  total: number;
}

const ANCHO = 420;
const ALTO = 160;
const PAD_X = 8;
const PAD_TOP = 14;
const PAD_BOTTOM = 22;

export default function WaterStackChart({ historico }: Props) {
  const puntos: Punto[] = historico
    .map((m) => ({
      fecha: m.fecha,
      intra: m.agua_intracelular_l,
      extra: m.agua_extracelular_l,
      total: m.agua_total_l,
    }))
    .filter((p): p is Punto => p.intra !== null && p.extra !== null && p.total !== null);

  if (puntos.length < 2) return null;

  const techo = Math.max(...puntos.map((p) => Math.max(p.total, p.intra + p.extra))) * 1.12 || 1;

  const x = (i: number) => PAD_X + (i / (puntos.length - 1)) * (ANCHO - PAD_X * 2);
  const y = (v: number) => PAD_TOP + (1 - v / techo) * (ALTO - PAD_TOP - PAD_BOTTOM);

  const base = ALTO - PAD_BOTTOM;

  const areaIntra = [
    `M ${x(0)} ${base}`,
    ...puntos.map((p, i) => `L ${x(i)} ${y(p.intra)}`),
    `L ${x(puntos.length - 1)} ${base}`,
    "Z",
  ].join(" ");

  const areaExtra = [
    `M ${x(0)} ${y(puntos[0].intra)}`,
    ...puntos.map((p, i) => `L ${x(i)} ${y(p.intra + p.extra)}`),
    ...[...puntos].reverse().map((p, i) => `L ${x(puntos.length - 1 - i)} ${y(p.intra)}`),
    "Z",
  ].join(" ");

  const ultimo = puntos[puntos.length - 1];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`Agua corporal apilada: intracelular y extracelular a lo largo de ${puntos.length} mediciones, en litros`}
      >
        {[techo, techo / 2].map((valor) => (
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

        <path d={areaExtra} className="fill-sky-300/25" />
        <path d={areaIntra} className="fill-sky-500/45" />

        {puntos.map((p, i) => (
          <g key={p.fecha}>
            <circle cx={x(i)} cy={y(p.total)} r={2.5} className="fill-white" />
            <circle cx={x(i)} cy={y(p.total)} r={12} fill="transparent">
              <title>
                {`${formatearFechaCorta(p.fecha)} — total ${p.total} L (intracelular ${p.intra} L, extracelular ${p.extra} L)`}
              </title>
            </circle>
          </g>
        ))}
      </svg>

      <figcaption className="mt-2">
        <div className="flex items-center justify-between gap-4 flex-wrap text-[10px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white/55">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm bg-sky-500/45" />
              Intracelular
              <span className="text-white/35 tabular-nums">{ultimo.intra} L</span>
            </span>
            <span className="flex items-center gap-1.5 text-white/55">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm bg-sky-300/25" />
              Extracelular
              <span className="text-white/35 tabular-nums">{ultimo.extra} L</span>
            </span>
          </div>
          <span className="text-white/45 font-semibold tabular-nums">Total {ultimo.total} L</span>
        </div>
      </figcaption>

      <table className="sr-only">
        <caption>Agua corporal — intracelular, extracelular y total, en litros</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Intracelular</th>
            <th scope="col">Extracelular</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {puntos.map((p) => (
            <tr key={p.fecha}>
              <td>{p.fecha}</td>
              <td>{p.intra} L</td>
              <td>{p.extra} L</td>
              <td>{p.total} L</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
