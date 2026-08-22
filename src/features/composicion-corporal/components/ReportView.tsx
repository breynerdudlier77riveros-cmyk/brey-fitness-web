import SectionCard from "@/features/composicion-corporal/components/SectionCard";

import ReportCover from "@/features/composicion-corporal/components/report/ReportCover";
import ReportFooter from "@/features/composicion-corporal/components/report/ReportFooter";
import ExecutiveSummary from "@/features/composicion-corporal/components/report/ExecutiveSummary";
import IndicatorGrid from "@/features/composicion-corporal/components/report/IndicatorGrid";
import BodyAnalysisSection from "@/features/composicion-corporal/components/report/BodyAnalysisSection";
import RangePositionSection from "@/features/composicion-corporal/components/report/RangePositionSection";
import ComparisonTable from "@/features/composicion-corporal/components/report/ComparisonTable";
import TrendsSection from "@/features/composicion-corporal/components/report/TrendsSection";
import TrendOverview from "@/features/composicion-corporal/components/report/TrendOverview";
import MeasurementTimeline from "@/features/composicion-corporal/components/report/MeasurementTimeline";
import PhotoGallery from "@/features/composicion-corporal/components/report/PhotoGallery";
import ReportInterpretation from "@/features/composicion-corporal/components/report/ReportInterpretation";
import ReportAppendix from "@/features/composicion-corporal/components/report/ReportAppendix";
import { AlertsBlock } from "@/features/composicion-corporal/components/report/AnalysisBlocks";
import BreyAI from "@/features/composicion-corporal/components/report/BreyAI";

import type { Reporte } from "@/lib/bcs/reporte";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { RecommendationReport } from "@/lib/bcs/recommendations";
import type { ClinicalObservationReport } from "@/lib/bcs/observation";
import type { Medicion } from "@/lib/bcs/tipos";
import type { Entregable } from "@/lib/bcs/copilot";
import { leerMedicion } from "@/lib/bcs/lectura-transversal";

// ── Vista del Reporte — ÚNICA implementación (BCS-ADR-05) ──────────────────
// La usan el panel del Entrenador (app/composicion-corporal/[clienteId]) y la
// vista pública (app/reportes/[token]): literalmente el mismo componente, sin
// prop de "modo". Los controles de edición viven en la página que lo envuelve,
// nunca aquí — eso garantiza la paridad de contenido por construcción.
//
// NO interpreta: compone. Toda cifra y todo texto llegan resueltos en
// `analisis` y `reporte`, calculados UNA vez en el Server Component de cada
// página. Aquí no se recorre el histórico ni se recalcula nada.
//
// ── CATORCE SECCIONES → OCHO (Sprint BCS-7.0) ─────────────────────────────
//
// El documento tenía catorce apartados de primer nivel y varios grupos
// contestaban la misma pregunta con distinta forma:
//
//   «¿Cómo está?»   → Indicadores principales · Análisis corporal ·
//                      Posición dentro del rango
//   «¿Cómo cambió?» → Comparación con la anterior · Gráficas de evolución ·
//                      Tendencias por variable
//   «¿Qué significa?» → cinco secciones seguidas (ver ReportInterpretation)
//
// Tres encabezados para una pregunta no dan tres respuestas: dan una respuesta
// troceada, y obligan al lector a recomponerla. Ahora cada pregunta tiene un
// apartado y los antiguos títulos siguen dentro como rótulos internos.
//
// NADA SE HA QUITADO. Los mismos componentes, los mismos datos, el mismo
// orden relativo: lo que cambia es la jerarquía.
//
// El orden general responde a cómo se lee un caso: qué se concluye, qué hay
// que revisar, qué se midió, cómo cambió, qué significa, y al final cómo se
// obtuvo todo.

interface Props {
  reporte: Reporte;
  analisis: BodyCompositionAnalysis;
  /**
   * Recomendaciones profesionales, generadas por el Recommendation Engine a
   * partir del mismo análisis. Llegan resueltas desde el Server Component:
   * este componente no evalúa ninguna regla.
   */
  recomendaciones: RecommendationReport;
  /**
   * Observaciones clínicas redactadas por el COG a partir de los dos DTO
   * anteriores. Llegan resueltas: este componente no redacta ninguna frase.
   */
  observaciones: ClinicalObservationReport;
  /**
   * Fecha de emisión (yyyy-mm-dd). Llega desde la página: este componente no
   * lee el reloj, para que portada y pie no puedan discrepar entre sí.
   */
  generadoEl: string;
  /**
   * Profesional que emite el reporte. Opcional: la vista pública se resuelve
   * por token y no conoce al entrenador (el DTO de UC-09 solo trae Cliente y
   * Mediciones). Cuando falta, la portada omite la fila — nunca inventa uno.
   */
  entrenador?: string;
  /**
   * La explicación en lenguaje corriente, compuesta por el copiloto (BCS-7.0).
   *
   * La reciben LAS DOS rutas, no solo la del entrenador: BCS-ADR-05 exige
   * paridad total de contenido, y esta sección es precisamente la que el
   * cliente abre el enlace para leer. `null` si el copiloto no pudo componerla
   * — entonces no se dibuja nada, nunca un hueco con título.
   */
  explicacionPaciente?: Entregable | null;
  /** Cuántos documentos más compuso el copiloto. Solo para remitir a ellos. */
  documentosCopiloto?: number;
  /** Solo el panel del Entrenador la pasa (BCS-ADR-05). */
  onCorregirMedicion?: (medicion: Medicion) => void;
}

/** Rótulo interno. NO es una Section Card: no se anidan (BCS-C02). */
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

export default function ReportView({
  reporte,
  analisis,
  recomendaciones,
  observaciones,
  generadoEl,
  entrenador,
  explicacionPaciente = null,
  documentosCopiloto = 0,
  onCorregirMedicion,
}: Props) {
  const { cliente, medicionActual, ficha, historico, tendencias, fotografias } = reporte;

  const filas = ficha.flatMap((bloque) => bloque.filas);
  const hayAlertas = analisis.avisos.some((a) => a.tipo === "alerta");
  const hayComparacion = historico.length >= 2;

  return (
    <div className="reporte-print space-y-6">
      <ReportCover
        clienteNombre={cliente.nombre}
        analisis={analisis}
        entrenador={entrenador}
        generadoEl={generadoEl}
      />

      <ExecutiveSummary analisis={analisis} />

      {/* Va aquí y no al final: si estuviera abajo, el cliente tendría que
          atravesar once secciones de jerga profesional para llegar a la única
          escrita para él, y no llegaría. */}
      <BreyAI entregable={explicacionPaciente} documentosDisponibles={documentosCopiloto} />

      {hayAlertas && (
        <SectionCard titulo="Datos a revisar">
          <AlertsBlock avisos={analisis.avisos} />
        </SectionCard>
      )}

      {/* ── ¿Cómo está? ──────────────────────────────────────────────────── */}
      <SectionCard titulo="Indicadores">
        <div className="space-y-7">
          <Sub titulo="Principales">
            <IndicatorGrid
              medicionActual={medicionActual}
              analisis={analisis}
              filas={filas}
              tendencias={tendencias}
            />
          </Sub>

          <Sub titulo="Todas las variables registradas">
            <BodyAnalysisSection ficha={ficha} tendencias={tendencias} />
          </Sub>

          {medicionActual.imc !== null && (
            <Sub titulo="Posición dentro del rango">
              <RangePositionSection imc={medicionActual.imc} filas={filas} />
            </Sub>
          )}
        </div>
      </SectionCard>

      {/* ── ¿Cómo cambió? ────────────────────────────────────────────────────
          Un solo apartado para el eje longitudinal. Antes eran tres encabezados
          seguidos —comparación, gráficas y tendencias— sobre exactamente los
          mismos puntos, y el lector tenía que recomponer una respuesta que el
          documento había troceado.

          Con una sola medición el apartado entero desaparece en vez de mostrar
          tres vacíos con título: no hay evolución que enseñar, y decirlo tres
          veces no lo mejora. El resumen ejecutivo y la explicación al cliente
          ya declaran que hace falta una segunda medición. */}
      {hayComparacion ? (
        <SectionCard titulo="Evolución">
          <div className="space-y-7">
            <Sub titulo="Respecto a la medición anterior">
              <ComparisonTable
                comparacion={analisis.comparacion}
                fechaAnterior={historico[1].fecha}
                fechaActual={medicionActual.fecha}
              />
            </Sub>

            <Sub titulo="Gráficas">
              <TrendsSection tendencias={tendencias} historico={historico} />
            </Sub>

            <Sub titulo="Tendencia por variable">
              <TrendOverview tendencias={analisis.tendencias} />
            </Sub>
          </div>
        </SectionCard>
      ) : null}

      {/* ── ¿Qué significa? y ¿qué hago? ─────────────────────────────────── */}
      <ReportInterpretation
        analisis={analisis}
        recomendaciones={recomendaciones}
        observaciones={observaciones}
        lecturas={leerMedicion(medicionActual, filas)}
      />

      <SectionCard titulo="Historial de mediciones">
        <MeasurementTimeline historico={historico} onCorregir={onCorregirMedicion} />
      </SectionCard>

      <ReportAppendix
        analisis={analisis}
        medicionActual={medicionActual}
        clienteNombre={cliente.nombre}
      />

      {fotografias.length > 0 && (
        <SectionCard titulo="Fotografías de progreso">
          <PhotoGallery fotografias={fotografias} />
        </SectionCard>
      )}

      <ReportFooter clienteNombre={cliente.nombre} generadoEl={generadoEl} />
    </div>
  );
}
