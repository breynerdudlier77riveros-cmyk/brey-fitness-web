import SectionCard from "@/features/composicion-corporal/components/SectionCard";
import ProfessionalInterpretation from "./ProfessionalInterpretation";
import ObservationSection from "./ObservationSection";
import RecommendationSection from "./RecommendationSection";
import { FindingsBlock, InsightsBlock } from "./AnalysisBlocks";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { RecommendationReport } from "@/lib/bcs/recommendations";
import type { ClinicalObservationReport } from "@/lib/bcs/observation";

// ── Bloque interpretativo del informe (Sprints BCS-4.0 · BCS-7.0) ──────────
//
// ── QUÉ SE ARREGLÓ EN BCS-7.0 ─────────────────────────────────────────────
//
// Este fichero montaba CINCO secciones seguidas:
//
//   Observaciones clínicas · Interpretación profesional ·
//   Recomendaciones profesionales · Interpretaciones del análisis · Hallazgos
//
// Cuatro de las cinco contestan a la misma pregunta —«¿qué significa esto?»—
// sobre los MISMOS hallazgos, cambiando solo la forma: prosa clínica del COG,
// prosa redactada aquí, combinaciones, y la lista cruda. El propio comentario
// de `ProfessionalInterpretation` lo dice: «la diferencia con la sección de
// Hallazgos: allí cada regla se lista por separado, aquí se redactan en prosa
// continua». Dos vistas del mismo dato, una debajo de la otra, ambas abiertas.
//
// Es el mismo defecto que la tarjeta del PAS tenía con su eje longitudinal, y
// se corrige igual: **un dueño por pregunta**, con el detalle disponible pero
// sin competir por la atención.
//
//   ¿Qué significa?  → «Interpretación», una sola sección.
//   ¿Qué hago?       → «Recomendaciones», que es OTRA pregunta y sigue aparte.
//
// NADA SE BORRA. Los hallazgos uno a uno pasan a un `<details>` dentro de la
// misma sección, que es donde estaban conceptualmente: son los hechos sobre
// los que se apoya la prosa de arriba, no una lectura alternativa. Quien
// audita el informe los abre; quien lo lee, no tropieza con ellos.
//
// `<details>` nativo y no un acordeón con estado: funciona sin JavaScript y el
// navegador ya gestiona la accesibilidad del disclosure. Mismo criterio que
// `TechnicalDetails` en el PAS.
//
// Ninguna de las cuatro añade interpretación propia: todas consumen el mismo
// `BodyCompositionAnalysis` ya resuelto.

interface Props {
  analisis: BodyCompositionAnalysis;
  recomendaciones: RecommendationReport;
  observaciones: ClinicalObservationReport;
}

/** Rótulo interno. No es una Section Card: no se anidan (BCS-C02). */
function Sub({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section aria-label={titulo}>
      <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

export default function ReportInterpretation({ analisis, recomendaciones, observaciones }: Props) {
  const hayInsights = analisis.insights.length > 0;
  const hayHallazgos = analisis.hallazgos.length > 0;

  return (
    <>
      <SectionCard titulo="Interpretación">
        <div className="space-y-7">
          {/* 1 · La lectura corrida. Abre porque enuncia el alcance —sobre
                 cuántas mediciones se apoya todo lo demás— antes de afirmar
                 nada. */}
          <ProfessionalInterpretation analisis={analisis} />

          {/* 2 · Las observaciones del motor clínico, con su trazabilidad. */}
          <Sub titulo="Observaciones clínicas">
            <ObservationSection informe={observaciones} />
          </Sub>

          {/* 3 · Combinaciones de hallazgos ya demostrados. Solo si las hay:
                 un rótulo con un vacío debajo es ruido. */}
          {hayInsights ? (
            <Sub titulo="Combinaciones observadas">
              <InsightsBlock insights={analisis.insights} />
            </Sub>
          ) : null}

          {/* 4 · Los hechos. Plegados, no escondidos: son la evidencia de todo
                 lo anterior y tienen que poder comprobarse sin salir del
                 documento. Al imprimir se despliegan solos: un informe en
                 papel no se puede desplegar, y la regla vive en globals.css
                 porque forzar un `<details>` abierto exige CSS —Tailwind no
                 puede escribir el atributo `open`, así que `print:open` habría
                 sido una clase inerte con aspecto de funcionar. */}
          {hayHallazgos ? (
            <details className="group bcs-hallazgos">
              <summary className="cursor-pointer list-none text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white/65">
                Ver los {analisis.hallazgos.length} hechos en los que se apoya
              </summary>
              <div className="mt-3 border-l-2 border-white/[0.08] pl-4">
                <FindingsBlock hallazgos={analisis.hallazgos} />
              </div>
            </details>
          ) : null}
        </div>
      </SectionCard>

      {/* Sigue siendo su propia sección: «qué significa» y «qué hago» son dos
          preguntas, y fundirlas convertiría una descripción en una indicación. */}
      <SectionCard titulo="Recomendaciones profesionales">
        <RecommendationSection informe={recomendaciones} />
      </SectionCard>
    </>
  );
}
