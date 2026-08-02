import { CATALOGO, type VariableId } from "@/lib/bcs/reporte";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Calidad del análisis (BCS Sprint 2.0) ──────────────────────────────────
// Cuánto respalda el dato a lo que el reporte afirma. Todo sale de recuentos
// sobre el DTO y de comprobar qué columnas vienen en null: no hay ninguna
// métrica de calidad inventada, ni puntuación global, ni semáforo.
//
// "Consistencia" es literalmente el número de validaciones cruzadas que
// fallaron (las que el motor ya evaluó), no un índice compuesto.

interface Props {
  analisis: BodyCompositionAnalysis;
  medicionActual: Medicion;
}

const TOTAL_VARIABLES = (Object.keys(CATALOGO) as VariableId[]).length;

function Fila({ etiqueta, valor, detalle }: { etiqueta: string; valor: string; detalle?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
      <dt className="text-sm text-white/60">{etiqueta}</dt>
      <dd className="text-right">
        <span className="text-sm font-bold text-white tabular-nums">{valor}</span>
        {detalle && <span className="block text-[10px] text-white/35 mt-0.5">{detalle}</span>}
      </dd>
    </div>
  );
}

export default function DataQualitySection({ analisis, medicionActual }: Props) {
  const variables = Object.keys(CATALOGO) as VariableId[];
  const disponibles = variables.filter((id) => medicionActual[id] !== null);
  const faltantes = variables.filter((id) => medicionActual[id] === null);

  const alertas = analisis.avisos.filter((a) => a.tipo === "alerta");
  const limitaciones = analisis.avisos.filter((a) => a.tipo === "limitacion");
  const comparables = analisis.comparacion.filter((c) => c.disponibilidad === "comparable");
  const conTendencia = analisis.tendencias.filter((t) => t.estado !== "insuficiente");

  return (
    <div className="grid sm:grid-cols-2 print:grid-cols-2 gap-x-8 gap-y-1">
      <dl>
        <Fila
          etiqueta="Mediciones analizadas"
          valor={String(analisis.cantidadMediciones)}
          detalle={
            analisis.cantidadMediciones >= 3
              ? "Suficientes para describir tendencias"
              : analisis.cantidadMediciones === 2
                ? "Permiten comparar, no describir una tendencia"
                : "Solo permiten describir el estado actual"
          }
        />
        <Fila
          etiqueta="Consistencia del dato"
          valor={alertas.length === 0 ? "Sin incidencias" : `${alertas.length} a revisar`}
          detalle="Validaciones cruzadas y rangos físicos"
        />
        <Fila
          etiqueta="Variables comparables"
          valor={`${comparables.length} / ${TOTAL_VARIABLES}`}
          detalle="Presentes en ambas mediciones"
        />
        <Fila
          etiqueta="Variables con evolución"
          valor={`${conTendencia.length} / ${TOTAL_VARIABLES}`}
          detalle="Con al menos dos registros"
        />
      </dl>

      <div>
        <dl>
          <Fila
            etiqueta="Variables registradas"
            valor={`${disponibles.length} / ${TOTAL_VARIABLES}`}
            detalle="En la medición más reciente"
          />
          <Fila
            etiqueta="Limitaciones documentadas"
            valor={String(limitaciones.length)}
            detalle="Detalladas en Metodología"
          />
        </dl>

        {faltantes.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5">
              No registradas en la última medición
            </p>
            <p className="text-xs text-white/45 leading-relaxed">
              {faltantes.map((id) => CATALOGO[id].etiqueta).join(" · ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
