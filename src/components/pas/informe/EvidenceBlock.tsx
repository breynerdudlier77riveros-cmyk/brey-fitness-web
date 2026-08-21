import { redactar, type LecturaEvidencia } from "@/lib/pas/evidencia";

// ── Qué evidencia hay, y qué falta (Sprints PAS-10E.1 · PAS-13) ────────────
//
// LO QUE ESTE COMPONENTE NO HACE: decidir nada.
//
// La lectura llega ya resuelta desde `@/lib/pas/evidencia`, calculada en la
// capa de composición. Aquí no se evalúa compatibilidad, no se sitúa ningún
// valor y no se redacta ninguna frase: se leen campos. Si mañana cambia una
// regla de evidencia, este fichero no se toca.
//
// ── QUÉ DEJÓ DE HACER EN PAS-13 ───────────────────────────────────────────
//
//   · Ya NO dibuja la escala ni la posición. Cuando hay una posición que
//     enseñar, la enseña la sección «Tu posición» de la tarjeta, que es su
//     dueña. Este bloque contestaba a la misma pregunta un poco más abajo y
//     con otras palabras, y la tarjeta acababa diciendo tres veces lo mismo.
//
//   · Ya NO enseña el ICC ni el CV. Describen cuánto se repite el
//     instrumento, no a la persona que se midió, y en la cara visible de un
//     informe solo consiguen que un número alto se lea como un buen
//     resultado. Están completos en los detalles técnicos.
//
// LO QUE SÍ HACE, Y ES SU RAZÓN DE SER: contestar cuando NO hay posición.
//
//   Seis situaciones distintas —y cinco con salida— se presentaban todas como
//   «no existe evidencia». Aquí cada una dice qué ocurre y, cuando la hay, qué
//   haría falta para desbloquearla.
//
// SIN SEMÁFORO. Ninguna de las fuentes registradas define categorías, así que
// ningún estado se pinta de verde ni de rojo.

interface Props {
  evidencia: LecturaEvidencia;
  /**
   * `true` cuando otra capa ya respondió al eje normativo de esta tarjeta.
   *
   * En ese caso este bloque no se dibuja: sería una segunda respuesta a la
   * misma pregunta.
   */
  normativaCubierta: boolean;
}

/** Cómo se nombra cada estado. Sin códigos y sin juicio. */
const TITULO: Readonly<Record<LecturaEvidencia["estado"], string>> = {
  EVIDENCIA_COMPATIBLE: "Referencia disponible",
  EVIDENCIA_PARCIAL: "Evidencia disponible",
  EVIDENCIA_NO_COMPATIBLE: "Evidencia publicada, no compatible con este perfil",
  NO_DETERMINABLE: "Falta un dato para poder comparar",
  NO_COMPARABLE: "Falta declarar cómo se midió",
  SIN_EVIDENCIA_UTILIZABLE: "Sin referencia utilizable",
};

export default function EvidenceBlock({ evidencia, normativaCubierta }: Props) {
  if (normativaCubierta) return null;

  const frase = redactar(evidencia);

  return (
    <section
      className="pas10e-evidencia border-t border-white/[0.06] pt-3"
      data-estado={evidencia.estado}
      aria-label="Evidencia"
    >
      <p className="text-[11px] uppercase tracking-wider text-white/35">
        {TITULO[evidencia.estado]}
      </p>

      <p className="mt-1 text-sm leading-relaxed text-white/70">{frase.texto}</p>

      {/* Qué falta. Es la parte que convierte un callejón sin salida en una
          tarea concreta, así que no se abrevia. */}
      {frase.limite ? (
        <p className="mt-2 text-[11px] leading-relaxed text-white/40">{frase.limite}</p>
      ) : null}

      {/* Y a quién hay que pedírselo. `origen` ya lo trae resuelto: no es lo
          mismo un dato que falta en la ficha del atleta que una condición que
          no se anotó al medir, y pedirle lo segundo al atleta no sirve. */}
      {evidencia.carencias.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {evidencia.carencias.map((c) => (
            <li
              key={`${c.origen}-${c.variable}`}
              data-origen={c.origen}
              className="border-l-2 border-white/10 pl-2 text-[11px] leading-relaxed text-white/45"
            >
              {c.detalle}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
