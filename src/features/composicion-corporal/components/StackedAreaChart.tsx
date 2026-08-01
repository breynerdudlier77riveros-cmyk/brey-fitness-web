// ── Gráfico de área apilada (BCS Design Handbook 11) ───────────────────────
// "Exclusivamente Agua corporal (VIZ-04): intra + extra = total." Único uso
// permitido de este tipo de gráfico en v1 — no se generaliza a otras
// variables.

import type { Medicion } from "@/lib/bcs/tipos";

interface Props {
  /** Ascendente (más antigua primero). */
  historico: Medicion[];
}

const ANCHO = 400;
const ALTO = 140;
const PAD = 24;

function formatearFecha(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es", { day: "2-digit", month: "short" });
}

export default function StackedAreaChart({ historico }: Props) {
  const puntos = historico
    .map((m) => ({ fecha: m.fecha, intra: m.agua_intracelular_l, extra: m.agua_extracelular_l, total: m.agua_total_l }))
    .filter((p): p is { fecha: string; intra: number; extra: number; total: number } =>
      p.intra !== null && p.extra !== null && p.total !== null
    );

  if (puntos.length < 2) return null;

  const max = Math.max(...puntos.map((p) => p.total)) * 1.1 || 1;

  const x = (i: number) => PAD + (i / (puntos.length - 1)) * (ANCHO - PAD * 2);
  const y = (v: number) => ALTO - PAD - (v / max) * (ALTO - PAD * 2);

  const intraArea = [
    `M ${x(0)} ${y(0)}`,
    ...puntos.map((p, i) => `L ${x(i)} ${y(p.intra)}`),
    `L ${x(puntos.length - 1)} ${y(0)}`,
    "Z",
  ].join(" ");

  const extraArea = [
    `M ${x(0)} ${y(puntos[0].intra)}`,
    ...puntos.map((p, i) => `L ${x(i)} ${y(p.intra + p.extra)}`),
    `L ${x(puntos.length - 1)} ${y(puntos[puntos.length - 1].intra)}`,
    "Z",
  ].join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="w-full h-auto" role="presentation" aria-hidden="true">
        <text x={PAD} y={14} className="fill-white/40 text-[9px]">
          {max.toFixed(1)} L
        </text>
        <path d={intraArea} className="fill-sky-500/40" />
        <path d={extraArea} className="fill-sky-300/25" />
        {puntos.map((p, i) => (
          <circle key={p.fecha} cx={x(i)} cy={y(p.total)} r={2.5} className="fill-white" />
        ))}
      </svg>
      <div className="flex justify-between mt-1 text-[10px] text-white/40">
        <span>{formatearFecha(puntos[0].fecha)}</span>
        <span>{formatearFecha(puntos[puntos.length - 1].fecha)}</span>
      </div>
      <div className="flex items-center gap-4 mt-2 text-[10px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-500/40" /> Intracelular
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-300/25" /> Extracelular
        </span>
      </div>

      <table className="sr-only">
        <caption>Agua corporal — intracelular, extracelular y total, en litros</caption>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Intracelular</th>
            <th>Extracelular</th>
            <th>Total</th>
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
    </div>
  );
}
