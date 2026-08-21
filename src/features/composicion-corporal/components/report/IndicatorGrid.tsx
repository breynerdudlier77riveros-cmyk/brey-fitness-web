import IndicatorCard from "./IndicatorCard";
import { CATALOGO, type VariableId } from "@/lib/bcs/reporte";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { Medicion } from "@/lib/bcs/tipos";
import type { FilaVariable } from "@/lib/bcs/reporte";

// ── Rejilla de indicadores principales (BCS Sprint 2.0) ────────────────────
// Los nueve indicadores que el reporte destaca, en el orden en que un
// profesional los lee: primero antropometría, luego composición, luego
// metabólicos. El resto de las 22 variables sigue disponible en el Timeline
// del histórico — aquí se destaca, no se esconde.

const INDICADORES: VariableId[] = [
  "peso_kg",
  "imc",
  "grasa_pct",
  "masa_muscular_kg",
  "agua_total_l",
  "masa_osea_kg",
  "proteina_kg",
  "bmr_kcal",
  "edad_metabolica",
];

interface Props {
  medicionActual: Medicion;
  analisis: BodyCompositionAnalysis;
  /** Filas de la ficha, que ya traen la clasificación calculada por el dominio. */
  filas: FilaVariable[];
}

export default function IndicatorGrid({ medicionActual, analisis, filas }: Props) {
  const porVariable = new Map(filas.map((f) => [f.id, f]));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-3">
      {INDICADORES.map((id) => {
        const def = CATALOGO[id];
        const fila = porVariable.get(id);

        // La clasificación viene del dominio; si está bloqueada por un dato
        // que el modelo no captura, se dice — nunca se deja el hueco mudo.
        const clasificacion =
          fila?.clasificacion?.etiqueta ??
          (fila?.bloqueoClasificacion ? "Sin clasificación disponible" : undefined);

        return (
          <IndicatorCard
            key={id}
            etiqueta={def.etiqueta}
            valor={medicionActual[id]}
            unidad={def.unidad}
            procedencia={def.procedencia}
            comparacion={analisis.comparacion.find((c) => c.variable === id)}
            tendencia={analisis.tendencias.find((t) => t.variable === id)}
            clasificacion={clasificacion}
            fecha={medicionActual.fecha}
          />
        );
      })}
    </div>
  );
}
