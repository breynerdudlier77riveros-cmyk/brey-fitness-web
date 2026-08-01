import { TrendUp, TrendDown, TrendFlat } from "@/components/brand/icons";
import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";
import type { EstadoTendencia, TendenciaMetrica } from "@/lib/bcs/analysis";
import { formatearDelta } from "./formato";

// ── Tendencias (BCS Sprint 3.0) ────────────────────────────────────────────
// Sección distinta de "Gráficas": el gráfico muestra la forma de la serie,
// esta tabla dice qué concluyó el motor sobre ella y con cuántos puntos. Un
// entrenador que solo mira la lista debe poder responder "¿qué se mueve y
// hacia dónde?" sin interpretar una curva.
//
// El estado y la razón vienen del DTO; aquí no se recalcula ninguna serie.

const ICONO: Record<EstadoTendencia, typeof TrendUp> = {
  ascendente: TrendUp,
  descendente: TrendDown,
  estable: TrendFlat,
  variable: TrendFlat,
  insuficiente: TrendFlat,
  indeterminada: TrendFlat,
};

const ETIQUETA: Record<EstadoTendencia, string> = {
  ascendente: "Al alza",
  descendente: "A la baja",
  estable: "Sin cambio",
  variable: "Variable",
  insuficiente: "Sin histórico",
  indeterminada: "Indeterminada",
};

interface Props {
  tendencias: TendenciaMetrica[];
}

export default function TrendOverview({ tendencias }: Props) {
  const conDatos = tendencias.filter((t) => t.estado !== "insuficiente");

  if (conDatos.length === 0) {
    return (
      <NotaSinHistorial>
        Se necesitan al menos 2 mediciones con la misma variable para describir su evolución.
      </NotaSinHistorial>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full text-sm border-collapse">
        <caption className="sr-only">
          Estado de la evolución de cada variable y número de mediciones usadas
        </caption>
        <thead>
          <tr className="text-[10px] font-bold tracking-[0.08em] uppercase text-white/40 border-b border-white/[0.10]">
            <th scope="col" className="text-left py-2.5 pr-3">
              Variable
            </th>
            <th scope="col" className="text-left py-2.5 px-3">
              Evolución
            </th>
            <th scope="col" className="text-right py-2.5 px-3">
              Cambio neto
            </th>
            <th scope="col" className="text-right py-2.5 pl-3">
              Mediciones
            </th>
          </tr>
        </thead>
        <tbody>
          {conDatos.map((t) => {
            const Icono = ICONO[t.estado];
            return (
              <tr key={t.variable} className="border-b border-white/[0.05] last:border-0">
                <th scope="row" className="text-left py-2.5 pr-3 font-medium text-white/80">
                  {t.etiqueta}
                </th>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/60">
                    <Icono className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.25} />
                    {ETIQUETA[t.estado]}
                  </span>
                </td>
                <td className="text-right py-2.5 px-3 text-white tabular-nums whitespace-nowrap">
                  {formatearDelta(t.cambioNeto, t.unidad)}
                </td>
                <td className="text-right py-2.5 pl-3 text-white/40 tabular-nums">{t.puntosUsados}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
