import type { PanelComparabilidad } from "@/lib/pas/report-v2";

// ── Panel de comparabilidad (PRS v2.0) ─────────────────────────────────────
//
// Responde «¿qué puedo comparar y qué no, y por qué?».
//
// Las descartadas van AGRUPADAS POR MOTIVO, no en lista. Una consulta de
// prensión evalúa 356 normas y descarta 354: enumerarlas sepultaría las dos que
// importan, y eso no sería transparencia sino ruido. El recuento por motivo
// conserva toda la información —«302 por método no equivalente»— y los ejemplos
// le ponen cara.
//
// El motivo íntegro es el que redactó el NIE. No se resume ni se reescribe:
// «método no equivalente (EQ-3)» dice algo muy concreto, y aplanarlo a «no
// aplica» perdería precisamente la razón.
//
// El símbolo nunca va solo: cada fila lleva su texto, y los símbolos van con
// `aria-hidden` y su palabra al lado para el lector de pantalla.

interface Props {
  panel: PanelComparabilidad;
}

export default function ComparabilityPanel({ panel }: Props) {
  return (
    <section className="prs2-comparabilidad" data-seccion-v2="comparabilidad">
      <h4 className="text-[11px] uppercase tracking-wider text-white/40">
        Normas evaluadas: {panel.evaluadas}
      </h4>

      <ul className="mt-2 space-y-1 text-sm">
        {panel.comparables.map((c) => (
          <li key={c.normaId} className="flex gap-2" data-comparable="si">
            <span aria-hidden="true" className="text-white/60">
              ✓
            </span>
            <span className="sr-only">Comparable: </span>
            <span className="text-white/80">
              {c.identidad}
              {/* El tipo distingue dos candidatas de la misma poblacion: sin el,
                  una TN-1 y una TN-2 se leen como la misma norma repetida. */}
              <span className="ml-1.5 text-white/40">· {c.tipo}</span>
            </span>
          </li>
        ))}

        {panel.descartes.map((d) => (
          <li
            key={d.motivoCorto}
            className="flex gap-2"
            data-comparable="no"
            data-motivo={d.motivoCorto}
            data-total={d.total}
          >
            <span aria-hidden="true" className="text-white/35">
              ✕
            </span>
            <span className="sr-only">Descartadas: </span>
            <span className="text-white/50">
              {/* «no comparables» / «no aplicables» / «sin determinar»: son
                  estados de comparabilidad, NO juicios de calidad. Escribir
                  solo «descartadas» invitaba a leerlas como normas malas. */}
              {d.total} {d.naturaleza} <span className="text-white/35">· {d.motivoCorto}</span>
              {d.ejemplos.length > 0 ? (
                <span className="block text-[11px] text-white/35">
                  {d.ejemplos.join(" · ")}
                  {d.total > d.ejemplos.length ? " …" : ""}
                </span>
              ) : null}
              <span className="sr-only">. {d.motivo}</span>
            </span>
          </li>
        ))}
      </ul>

      {panel.comparables.length === 0 ? (
        <p className="mt-2 text-[11px] text-white/50">
          Ninguna norma de la base de conocimiento corresponde a esta medición. No es una
          afirmación sobre el resultado: es una afirmación sobre la evidencia disponible.
        </p>
      ) : null}
    </section>
  );
}
