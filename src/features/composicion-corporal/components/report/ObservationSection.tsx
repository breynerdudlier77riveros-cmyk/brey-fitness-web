import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";
import type { BloqueInforme, ClinicalObservationReport, Observacion } from "@/lib/bcs/observation";

// ── Observaciones clínicas (COG v1.0) ──────────────────────────────────────
// Renderiza el ClinicalObservationReport. No decide nada: bloques, orden y
// texto llegan resueltos desde el motor.
//
// La traza de cada observación se muestra en línea, plegada visualmente al
// pie de cada bloque. Es deliberado: un informe que va a un cliente debe poder
// auditarse sin salir del documento, pero la traza no puede competir con la
// lectura profesional.

function Traza({ observacion }: { observacion: Observacion }) {
  const t = observacion.trazabilidad;
  const partes = [
    t.ruleId,
    t.knowledgeIds.length > 0 ? `CKB: ${t.knowledgeIds.join(", ")}` : null,
    t.referenceIds.length > 0 ? `Ref: ${t.referenceIds.join(", ")}` : null,
    `Evidencia: ${t.evidenceLevel}`,
  ].filter(Boolean);

  return (
    <p className="text-[9px] text-white/25 mt-2 leading-relaxed">
      {partes.join(" · ")}
    </p>
  );
}

function Bloque({ bloque }: { bloque: BloqueInforme }) {
  if (bloque.estado === "sin_datos") return null;

  return (
    <section aria-label={bloque.titulo}>
      <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-2.5">
        {bloque.titulo}
      </h3>

      <div className="space-y-3">
        {bloque.observaciones.map((o) => (
          <article key={o.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-sm text-white/75 leading-relaxed">{o.texto}</p>
            <Traza observacion={o} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ObservationSection({ informe }: { informe: ClinicalObservationReport }) {
  const emitidos = informe.bloques.filter((b) => b.estado === "emitido");

  if (emitidos.length === 0) {
    return (
      <NotaSinHistorial>
        Ninguna plantilla del catálogo se activó con los datos disponibles.
      </NotaSinHistorial>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-white/45">
        {informe.meta.observacionesEmitidas}{" "}
        {informe.meta.observacionesEmitidas === 1 ? "observación redactada" : "observaciones redactadas"} sobre{" "}
        {informe.meta.plantillasEvaluadas} plantillas evaluadas. Cada una conserva la traza de la
        regla, el conocimiento y la referencia que la sostienen.
      </p>

      {emitidos.map((b) => (
        <Bloque key={b.bloque} bloque={b} />
      ))}
    </div>
  );
}
