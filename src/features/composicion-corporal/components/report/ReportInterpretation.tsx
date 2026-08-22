import SectionCard from "@/features/composicion-corporal/components/SectionCard";
import ProfessionalInterpretation from "./ProfessionalInterpretation";
import ObservationSection from "./ObservationSection";
import RecommendationSection from "./RecommendationSection";
import { FindingsBlock, InsightsBlock } from "./AnalysisBlocks";
import CrossSectionalReading from "./CrossSectionalReading";
import GuidanceSection from "./GuidanceSection";
import type { LecturaTransversal } from "@/lib/bcs/lectura-transversal";
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
  /**
   * Lo que puede decirse del CUERPO con la medición actual (BCS-8.0).
   *
   * Va la primera del apartado. Todo lo demás que hay aquí habla del análisis
   * —cuántas mediciones lo sostienen, qué no puede clasificarse— y sin esto
   * el apartado entero era un informe que solo sabía hablar de sus propias
   * limitaciones.
   */
  lecturas?: readonly LecturaTransversal[];
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

export default function ReportInterpretation({
  analisis,
  recomendaciones,
  observaciones,
  lecturas = [],
}: Props) {
  const hayInsights = analisis.insights.length > 0;
  const hayHallazgos = analisis.hallazgos.length > 0;

  return (
    <>
      <SectionCard titulo="Interpretación">
        <div className="space-y-7">
          {/* 1 · Lo que dicen tus cifras. Primero, y separado de todo lo
                 demás: es la única parte del apartado que habla del cuerpo.
                 No necesita histórico ni norma poblacional — sale de las
                 relaciones entre las variables de esta misma medición. */}
          {lecturas.length > 0 ? (
            <Sub titulo="Lo que dicen tus cifras">
              <CrossSectionalReading lecturas={lecturas} />
            </Sub>
          ) : null}

          {/* 2 · El alcance: sobre cuántas mediciones se apoya lo anterior.
                 Va DESPUÉS, como marco de lo afirmado. Iba delante, y siendo
                 lo único que había, el apartado entero se leía como una
                 disculpa. */}
          <Sub titulo="Alcance de este análisis">
            <ProfessionalInterpretation analisis={analisis} />
          </Sub>

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
      {/* «Qué hago» es UNA pregunta, y por eso las dos partes van en el
          mismo apartado. Estuvieron a punto de ser dos secciones seguidas —
          exactamente la fragmentación que BCS-7.0 quitó del informe— hasta
          que el test que fija la lista de apartados obligó a mirarlo. */}
      {/* ORDEN INVERTIDO EN BCS-11. Iba primero «Sobre este registro» —lo que
          hay que verificar del dato— y la orientación por objetivo quedaba al
          final de un documento de diecinueve páginas. Es la parte que un
          profesional usa para decidir algo, y la última que veía.
          .
          Ahora abre el apartado. Las notas sobre el registro siguen dentro,
          debajo: son importantes y no urgentes. */}
      <SectionCard titulo="Recomendaciones">
        <div className="space-y-7">
          <Sub titulo="Según el objetivo">
            <GuidanceSection />
          </Sub>

          <Sub titulo="Sobre este registro">
            <RecommendationSection informe={recomendaciones} />
          </Sub>
        </div>
      </SectionCard>
    </>
  );
}
