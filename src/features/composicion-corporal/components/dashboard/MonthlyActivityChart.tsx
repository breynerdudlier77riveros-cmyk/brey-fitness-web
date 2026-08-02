import { escalar } from "@/lib/bcs/dashboard";
import type { MesActividad } from "@/lib/bcs/dashboard";
import { etiquetaMes } from "@/lib/bcs/dashboard";

// ── Actividad mensual (zona 3) · barras ────────────────────────────────────
// SVG puro. Solo histórico: el eje termina en el mes en curso y nunca proyecta.
// Tabla sr-only para que un lector de pantalla no dependa del gráfico.

const ANCHO = 480;
const ALTO = 150;
const PAD = 20;

export default function MonthlyActivityChart({ meses }: { meses: MesActividad[] }) {
  const valores = meses.map((m) => m.mediciones);
  const escala = escalar(valores, ALTO - 14, PAD);

  if (!escala) {
    return <p className="text-xs text-white/40 italic py-4">Sin mediciones registradas en el periodo.</p>;
  }

  const anchoBarra = (ANCHO - PAD * 2) / meses.length;
  const base = ALTO - 14 - PAD;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Mediciones por mes durante ${meses.length} meses. Máximo ${escala.maximo} en un mes.`}
      >
        {meses.map((m, i) => {
          const y = escala.puntos[i];
          const alto = Math.max(base - y, m.mediciones > 0 ? 2 : 0);
          return (
            <g key={m.mes}>
              <rect
                x={PAD + i * anchoBarra + anchoBarra * 0.18}
                y={y}
                width={anchoBarra * 0.64}
                height={alto}
                rx={2}
                className="fill-orange-400/70"
              >
                <title>{`${m.mes}: ${m.mediciones} mediciones, ${m.clientesNuevos} clientes nuevos`}</title>
              </rect>
              <text
                x={PAD + i * anchoBarra + anchoBarra / 2}
                y={ALTO - 2}
                textAnchor="middle"
                className="fill-white/35 text-[8px]"
              >
                {etiquetaMes(m.mes)}
              </text>
            </g>
          );
        })}
      </svg>

      <table className="sr-only">
        <caption>Actividad mensual del consultorio</caption>
        <thead>
          <tr>
            <th scope="col">Mes</th>
            <th scope="col">Mediciones</th>
            <th scope="col">Clientes nuevos</th>
            <th scope="col">Enlaces generados</th>
            <th scope="col">Enlaces revocados</th>
          </tr>
        </thead>
        <tbody>
          {meses.map((m) => (
            <tr key={m.mes}>
              <td>{m.mes}</td>
              <td>{m.mediciones}</td>
              <td>{m.clientesNuevos}</td>
              <td>{m.enlacesGenerados}</td>
              <td>{m.enlacesRevocados}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
