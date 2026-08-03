import type { Interpretacion } from "@/lib/pas/interpretation";

// ── Lista de interpretaciones (Sprint PAS-5.0) ─────────────────────────────
// Muestra el texto del PIE **literalmente**. No recorta, no reescribe, no
// añade conectores y no reordena: el orden llega ya resuelto por prioridad
// desde el motor de interpretación.
//
// Cada elemento expone su regla y sus referencias porque la trazabilidad es
// parte del documento, no un detalle de depuración: un profesional debe poder
// discrepar de una afirmación sabiendo de dónde salió.

interface Props {
  interpretaciones: readonly Interpretacion[];
  /** Cuando no hay ninguna. Descriptivo, nunca una conclusión. */
  vacio?: string;
  /** Oculta la línea de procedencia en listas anidadas muy densas. */
  compacto?: boolean;
}

export default function InterpretationList({ interpretaciones, vacio, compacto }: Props) {
  if (interpretaciones.length === 0) {
    return vacio ? <p className="text-sm text-white/50">{vacio}</p> : null;
  }

  return (
    <ul className="space-y-3">
      {interpretaciones.map((interpretacion) => (
        <li
          key={interpretacion.id}
          data-regla={interpretacion.regla}
          data-prioridad={interpretacion.prioridad}
          className="prs-item border-l-2 border-white/15 pl-3"
        >
          <p className="text-sm leading-relaxed text-white/80">{interpretacion.texto}</p>

          {compacto ? null : (
            <p className="mt-1 text-[11px] text-white/40">
              <span className="font-semibold">{interpretacion.regla}</span>
              {interpretacion.referencias.length > 0 ? (
                <> · {interpretacion.referencias.join(", ")}</>
              ) : null}
              {interpretacion.trazabilidad.fichasPKB.length > 0 ? (
                <> · {interpretacion.trazabilidad.fichasPKB.join(", ")}</>
              ) : null}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
