import LineChart from "./LineChart";
import WaterStackChart from "./WaterStackChart";
import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";
import type { SerieTendencia } from "@/lib/bcs/reporte";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Evolución (BCS Sprint 2.0) ─────────────────────────────────────────────
// Una serie por variable con al menos 2 puntos (BCS Handbook 07, mínimo para
// dibujar una línea), más el apilado de agua corporal, que es el único uso
// permitido de ese tipo de gráfico en v1 (VIZ-04).
//
// Los datos llegan ya filtrados y ordenados por el dominio: aquí solo se
// decide la disposición.

interface Props {
  tendencias: SerieTendencia[];
  /** Mediciones vigentes, de la más reciente a la más antigua. */
  historico: Medicion[];
}

export default function TrendsSection({ tendencias, historico }: Props) {
  const series = tendencias.filter((s) => s.tipoGrafico === "linea" && s.puntos.length >= 2);
  const hayAgua = tendencias.some((s) => s.id === "agua_total_l");

  if (series.length === 0 && !hayAgua) {
    return (
      <NotaSinHistorial>
        Se necesitan al menos 2 mediciones con la misma variable para dibujar su evolución.
      </NotaSinHistorial>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-x-8 gap-y-6">
      {series.map((serie) => (
        <div key={serie.id}>
          <p className="text-xs font-bold text-white/70 mb-2">{serie.etiqueta}</p>
          <LineChart puntos={serie.puntos} unidad={serie.unidad} etiqueta={serie.etiqueta} />
        </div>
      ))}

      {hayAgua && (
        <div>
          <p className="text-xs font-bold text-white/70 mb-2">Agua corporal</p>
          {/* El apilado necesita orden ascendente; el histórico llega descendente. */}
          <WaterStackChart historico={[...historico].reverse()} />
        </div>
      )}
    </div>
  );
}
