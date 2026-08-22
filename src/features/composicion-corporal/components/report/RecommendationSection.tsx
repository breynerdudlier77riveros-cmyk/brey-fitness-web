import { CATEGORIAS, PRIORIDADES } from "@/lib/bcs/recommendations";
import type {
  PrioridadRecomendacion,
  ProfessionalRecommendation,
  RecommendationReport,
} from "@/lib/bcs/recommendations";
import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";

/**
 * Reglas cuya tarjeta NO se dibuja aquí, y por qué.
 *
 * `R-14` y `R-15` no emiten una acción: su «acción profesional» dice
 * «considerar el valor y su evolución», que es lo que se hace de todos modos.
 * Lo que sí aportan —el motivo por el que una variable no se clasifica— ya
 * tiene su propio apartado, «Qué no puede interpretarse», y en el informe
 * exportado aparecían cuatro tarjetas completas repitiéndolo.
 *
 * NO se apagan en el motor: sus observaciones y sus recuentos siguen siendo
 * correctos y otras vistas las consumen. Se filtran en la presentación, que es
 * donde estaba el problema.
 */
const SIN_TARJETA_PROPIA = ['R-14-clasificacion-bloqueada', 'R-15-agua-no-verificable'];

// ── Recomendaciones profesionales (Sprint BCS-4.0) ─────────────────────────
// Renderiza el informe del Recommendation Engine. No decide nada: prioridad,
// categoría, texto y evidencia llegan resueltos.
//
// Cada tarjeta muestra su regla y su fuente. Es deliberado: un profesional
// que entrega este documento debe poder responder "¿de dónde sale esto?" sin
// salir del informe.

const ESTILO_PRIORIDAD: Record<PrioridadRecomendacion, string> = {
  alta: "border-l-yellow-500 bg-yellow-500/[0.06]",
  media: "border-l-sky-500 bg-sky-500/[0.05]",
  baja: "border-l-white/25 bg-white/[0.02]",
  informativa: "border-l-white/15 bg-white/[0.015]",
};

const ESTILO_CHIP: Record<PrioridadRecomendacion, string> = {
  alta: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  media: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  baja: "border-white/15 bg-white/[0.04] text-white/60",
  informativa: "border-white/12 bg-white/[0.03] text-white/45",
};

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/35 mb-0.5">
        {etiqueta}
      </dt>
      <dd className="text-xs text-white/60 leading-relaxed">{children}</dd>
    </div>
  );
}

function Tarjeta({ recomendacion }: { recomendacion: ProfessionalRecommendation }) {
  const r = recomendacion;

  return (
    <article
      className={`rounded-xl border border-white/[0.07] border-l-4 ${ESTILO_PRIORIDAD[r.prioridad]} p-4`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
        <h4 className="font-bold text-white text-sm">{r.titulo}</h4>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-[0.08em] rounded-full border border-white/12 bg-white/[0.03] text-white/50 px-2 py-0.5">
            {CATEGORIAS[r.categoria].etiqueta}
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-[0.08em] rounded-full border px-2 py-0.5 ${ESTILO_CHIP[r.prioridad]}`}
          >
            {PRIORIDADES[r.prioridad].etiqueta}
          </span>
        </div>
      </div>

      <p className="text-sm text-white/70 leading-relaxed mb-3">{r.descripcion}</p>

      <dl className="space-y-2.5">
        <Campo etiqueta="Acción profesional">{r.accionProfesional}</Campo>
        <Campo etiqueta="Fundamento">{r.fundamento}</Campo>
        {r.seguimiento && <Campo etiqueta="Seguimiento">{r.seguimiento}</Campo>}
        {r.limitaciones.length > 0 && (
          <Campo etiqueta="Limitaciones">
            <ul className="list-disc pl-4 space-y-0.5">
              {r.limitaciones.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </Campo>
        )}
      </dl>

      <p className="text-[9px] text-white/25 mt-3 pt-2.5 border-t border-white/[0.05] leading-relaxed">
        {r.regla} · {r.evidencia.referencia} — «{r.evidencia.cita}»
      </p>
    </article>
  );
}

export default function RecommendationSection({ informe }: { informe: RecommendationReport }) {
  const { limitaciones, resumen, reglasEvaluadas } = informe;

  // Las que sí piden una acción. Ver `SIN_TARJETA_PROPIA`.
  const recomendaciones = informe.recomendaciones.filter(
    (r) => !SIN_TARJETA_PROPIA.includes(r.regla),
  );
  const remitidas = informe.recomendaciones.length - recomendaciones.length;

  return (
    <div className="space-y-5">
      {recomendaciones.length > 0 ? (
        <>
          <p className="text-xs text-white/45">
            {recomendaciones.length}{" "}
            {recomendaciones.length === 1 ? "recomendación emitida" : "recomendaciones emitidas"} sobre{" "}
            {reglasEvaluadas} reglas evaluadas
            {resumen.alta > 0 && ` · ${resumen.alta} de prioridad alta`}.
            {remitidas > 0 &&
              ` Otras ${remitidas} señalan variables que no pueden clasificarse: su motivo está en «Qué no puede interpretarse».`}
          </p>

          <div className="space-y-3">
            {recomendaciones.map((r) => (
              <Tarjeta key={r.id} recomendacion={r} />
            ))}
          </div>
        </>
      ) : (
        <NotaSinHistorial>
          Ninguna regla del catálogo se activó con los datos disponibles.
        </NotaSinHistorial>
      )}

      <div className="pt-4 border-t border-white/[0.07]">
        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-2">
          Ámbitos sobre los que no se emiten recomendaciones
        </p>
        <ul className="space-y-1.5">
          {limitaciones.map((l) => (
            <li key={l.id} className="text-xs text-white/45 leading-relaxed">
              <span className="font-semibold text-white/65">{l.ambito}:</span> {l.motivo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
