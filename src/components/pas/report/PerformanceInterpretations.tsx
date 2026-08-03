import PerformanceSection from "./PerformanceSection";
import InterpretationList from "./InterpretationList";
import type { FilaCapacidad } from "@/lib/pas/report";

// ── Interpretaciones profesionales (Sprint PAS-5.0) ────────────────────────
// El texto del PIE, literal y en su orden. Este componente no redacta ni una
// palabra: agrupa por capacidad para que se lea por bloques en vez de como una
// lista plana de cincuenta frases.
//
// Se muestran TODAS las capacidades con interpretación, incluidas las
// desconocidas. Filtrarlas dejaría un informe que solo habla de lo que se sabe,
// que es justo la lectura que este ecosistema evita.

interface Props {
  filas: readonly FilaCapacidad[];
}

export default function PerformanceInterpretations({ filas }: Props) {
  const conTexto = filas.filter((fila) => fila.interpretaciones.length > 0);

  return (
    <PerformanceSection
      id="interpretaciones"
      nota="Texto emitido por el motor de interpretación. Se reproduce sin modificaciones."
    >
      {conTexto.length === 0 ? (
        <p className="text-sm text-white/50">
          El motor de interpretación no emitió observaciones por capacidad.
        </p>
      ) : (
        <div className="space-y-5">
          {conTexto.map((fila) => (
            <article
              key={fila.capacidad}
              data-capacidad={fila.capacidad}
              className="prs-bloque"
            >
              <h3 className="mb-2 text-sm font-bold">
                {fila.nombre}
                <span className="ml-1.5 text-[11px] font-normal text-white/40">
                  {fila.capacidad}
                </span>
              </h3>
              <InterpretationList interpretaciones={fila.interpretaciones} />
            </article>
          ))}
        </div>
      )}
    </PerformanceSection>
  );
}
