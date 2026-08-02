import { segmentosDonut } from "@/lib/bcs/dashboard";
import type { SegmentoDistribucion } from "@/lib/bcs/dashboard";

// ── Distribuciones (zona 6) · donut y stack ────────────────────────────────
// SVG puro. El donut se dibuja con stroke-dasharray sobre un círculo, sin
// trigonometría ni paths generados: menos código y menos margen de error.

const TAMANO = 120;
const RADIO = 44;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

const COLORES = ["stroke-orange-400", "stroke-sky-400", "stroke-emerald-400", "stroke-white/30"];
const FONDOS = ["bg-orange-400", "bg-sky-400", "bg-emerald-400", "bg-white/30"];

interface Props {
  segmentos: SegmentoDistribucion[];
  titulo: string;
  variante?: "donut" | "stack";
}

export default function ClientDistributionChart({ segmentos, titulo, variante = "donut" }: Props) {
  const partes = segmentosDonut(segmentos);

  if (partes.length === 0) {
    return <p className="text-xs text-white/40 italic py-4">Sin datos para distribuir.</p>;
  }

  const total = segmentos.reduce((n, s) => n + s.valor, 0);
  const descripcion = partes.map((p) => `${p.etiqueta}: ${p.valor}`).join(", ");

  return (
    <figure className="m-0">
      {variante === "donut" ? (
        <div className="flex items-center gap-5 flex-wrap">
          <svg
            viewBox={`0 0 ${TAMANO} ${TAMANO}`}
            className="w-28 h-28 flex-shrink-0 -rotate-90"
            role="img"
            aria-label={`${titulo}. ${descripcion}.`}
          >
            {partes.map((p, i) => (
              <circle
                key={p.etiqueta}
                cx={TAMANO / 2}
                cy={TAMANO / 2}
                r={RADIO}
                fill="none"
                strokeWidth={14}
                className={COLORES[i % COLORES.length]}
                strokeDasharray={`${(p.porcentaje / 100) * CIRCUNFERENCIA} ${CIRCUNFERENCIA}`}
                strokeDashoffset={-(p.desde / 100) * CIRCUNFERENCIA}
              >
                <title>{`${p.etiqueta}: ${p.valor} (${p.porcentaje.toFixed(0)} %)`}</title>
              </circle>
            ))}
          </svg>

          <ul className="space-y-1.5 min-w-0">
            {partes.map((p, i) => (
              <li key={p.etiqueta} className="flex items-center gap-2 text-xs text-white/60">
                <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${FONDOS[i % FONDOS.length]}`} />
                <span className="truncate">{p.etiqueta}</span>
                <span className="text-white/40 tabular-nums ml-auto">{p.valor}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <div
            className="flex h-4 rounded-full overflow-hidden"
            role="img"
            aria-label={`${titulo}. ${descripcion}.`}
          >
            {partes.map((p, i) => (
              <span
                key={p.etiqueta}
                style={{ width: `${p.porcentaje}%` }}
                className={FONDOS[i % FONDOS.length]}
                title={`${p.etiqueta}: ${p.valor}`}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            {partes.map((p, i) => (
              <li key={p.etiqueta} className="flex items-center gap-1.5 text-[11px] text-white/55">
                <span aria-hidden="true" className={`w-2 h-2 rounded-sm ${FONDOS[i % FONDOS.length]}`} />
                {p.etiqueta} <span className="text-white/35 tabular-nums">{p.valor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <table className="sr-only">
        <caption>{`${titulo} — total ${total}`}</caption>
        <thead><tr><th scope="col">Categoría</th><th scope="col">Clientes</th></tr></thead>
        <tbody>
          {segmentos.map((s) => (
            <tr key={s.etiqueta}><td>{s.etiqueta}</td><td>{s.valor}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
