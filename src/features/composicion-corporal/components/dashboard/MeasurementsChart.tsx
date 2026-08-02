import { escalar } from "@/lib/bcs/dashboard";
import type { PuntoSerie } from "@/lib/bcs/dashboard";

// ── Línea temporal (zona 3) ────────────────────────────────────────────────
// Misma serie que el gráfico de barras, en forma de línea con área: la barra
// permite comparar meses concretos y la línea muestra la trayectoria.

const ANCHO = 480;
const ALTO = 140;
const PAD = 18;

interface Props {
  serie: PuntoSerie[];
  titulo: string;
}

export default function MeasurementsChart({ serie, titulo }: Props) {
  const valores = serie.map((p) => p.valor);
  const escala = escalar(valores, ALTO, PAD);

  if (!escala) {
    return <p className="text-xs text-white/40 italic py-4">Sin datos en el periodo.</p>;
  }

  const x = (i: number) => PAD + (i / Math.max(serie.length - 1, 1)) * (ANCHO - PAD * 2);
  const linea = escala.puntos.map((y, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${linea} L ${x(serie.length - 1).toFixed(1)} ${ALTO - PAD} L ${x(0).toFixed(1)} ${ALTO - PAD} Z`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${titulo}. Máximo ${escala.maximo}.`}
      >
        <line x1={PAD} x2={ANCHO - PAD} y1={PAD} y2={PAD} className="stroke-white/[0.07]" strokeDasharray="3 4" />
        <text x={PAD} y={PAD - 4} className="fill-white/30 text-[8px]">{escala.maximo}</text>

        <path d={area} className="fill-sky-500/12" />
        <path d={linea} fill="none" className="stroke-sky-400" strokeWidth={2} strokeLinejoin="round" />

        {escala.puntos.map((y, i) => (
          <circle key={serie[i].etiqueta + i} cx={x(i)} cy={y} r={2.5} className="fill-sky-400">
            <title>{`${serie[i].etiqueta}: ${serie[i].valor}`}</title>
          </circle>
        ))}
      </svg>

      <figcaption className="flex justify-between mt-1 text-[9px] text-white/30">
        <span>{serie[0].etiqueta}</span>
        <span>{serie[serie.length - 1].etiqueta}</span>
      </figcaption>

      <table className="sr-only">
        <caption>{titulo}</caption>
        <thead><tr><th scope="col">Periodo</th><th scope="col">Valor</th></tr></thead>
        <tbody>
          {serie.map((p, i) => (
            <tr key={p.etiqueta + i}><td>{p.etiqueta}</td><td>{p.valor}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
