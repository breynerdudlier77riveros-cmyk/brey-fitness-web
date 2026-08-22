import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import { formatearFechaLarga } from "./formato";

// ── Conclusión (BCS Sprint 3.0) ────────────────────────────────────────────
// Cierre del documento. NO introduce ninguna conclusión nueva: reexpone el
// veredicto que el motor ya emitió (`analisis.resumen`) más el alcance real
// de lo analizado, y declara explícitamente qué queda fuera.
//
// Es deliberadamente breve: si el entrenador solo lee la primera y la última
// página, debe quedarse con lo mismo que si leyera el informe entero.

interface Props {
  analisis: BodyCompositionAnalysis;
  clienteNombre: string;
}

export default function ConclusionSection({ analisis, clienteNombre }: Props) {
  const { resumen, cantidadMediciones, fechaInicial, fechaFinal, avisos, insights } = analisis;

  const alertas = avisos.filter((a) => a.tipo === "alerta").length;
  const limitaciones = avisos.filter((a) => a.tipo === "limitacion").length;

  const periodo =
    fechaInicial && fechaFinal && fechaInicial !== fechaFinal
      ? `entre el ${formatearFechaLarga(fechaInicial)} y el ${formatearFechaLarga(fechaFinal)}`
      : fechaFinal
        ? `correspondiente al ${formatearFechaLarga(fechaFinal)}`
        : "sin mediciones registradas";

  return (
    <div className="space-y-3 max-w-3xl">
      <p className="text-sm text-white/75 leading-relaxed">
        Este informe recoge {cantidadMediciones}{" "}
        {cantidadMediciones === 1 ? "medición" : "mediciones"} de composición corporal de{" "}
        {clienteNombre}, {periodo}. {resumen.texto}
      </p>

      <p className="text-sm text-white/60 leading-relaxed">
        {insights.length > 0
          ? insights.length === 1
            ? "Se emitió una interpretación a partir de los hallazgos verificados."
            : `Se emitieron ${insights.length} interpretaciones a partir de los hallazgos verificados.`
          : "No se emitieron interpretaciones: los datos disponibles no permiten combinar hallazgos."}{" "}
        {alertas > 0
          ? alertas === 1
            ? "Queda un dato pendiente de revisión antes de considerar el registro definitivo."
            : `Quedan ${alertas} datos pendientes de revisión antes de considerar el registro definitivo.`
          : "No se detectaron incidencias de consistencia en los datos registrados."}{" "}
        {limitaciones > 0 &&
          `${limitaciones === 1 ? "Una variable no pudo interpretarse" : `${limitaciones} aspectos no pudieron interpretarse`} por ausencia de datos que el sistema no captura; el detalle figura en Metodología.`}
      </p>

      <p className="text-[11px] text-white/40 leading-relaxed pt-2 border-t border-white/[0.07]">
        El contenido de este documento describe mediciones y su evolución. No sustituye una
        valoración médica ni establece relaciones de causa entre los cambios observados.
      </p>
    </div>
  );
}
