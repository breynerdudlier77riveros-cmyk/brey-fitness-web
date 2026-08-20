import EvidenceScale from "@/components/pas/evidencia/EvidenceScale";
import { redactar, type LecturaEvidencia } from "@/lib/pas/evidencia";

// ── Bloque de evidencia de la tarjeta (Sprint PAS-10E.1) ───────────────────
//
// LO QUE ESTE COMPONENTE NO HACE: decidir nada.
//
// La lectura llega ya resuelta desde `@/lib/pas/evidencia`, calculada en la
// capa de composición. Aquí no se evalúa compatibilidad, no se sitúa ningún
// valor y no se redacta ninguna frase: se leen campos. Si mañana cambia una
// regla de evidencia, este fichero no se toca.
//
// LOS SIETE CASOS DEL §A5, CADA UNO CON SU FORMA.
//
//   El defecto que corrige: seis situaciones distintas —y cinco con salida—
//   se presentaban todas como «no existe evidencia». Aquí cada una dice qué
//   ocurre y, cuando la hay, qué haría falta para desbloquearla.
//
// SIN SEMÁFORO. Ninguna de las fuentes registradas define categorías, así que
// ningún estado se pinta de verde ni de rojo. El color distingue jerarquía de
// interfaz, nunca calidad del resultado.

interface Props {
  evidencia: LecturaEvidencia;
  observado: number;
  unidad: string;
  /**
   * `true` cuando la NKB ya respondió al eje normativo de esta tarjeta.
   *
   * En ese caso este bloque NO repite la comparación —sería una segunda
   * respuesta a la misma pregunta— y se limita a la evidencia complementaria:
   * fiabilidad, error de medida y lo que falte por cargar.
   */
  normativaCubierta: boolean;
}

/** Cómo se nombra cada estado en la lectura principal. Sin códigos. */
const TITULO: Readonly<Record<LecturaEvidencia["estado"], string>> = {
  EVIDENCIA_COMPATIBLE: "Referencia disponible",
  EVIDENCIA_PARCIAL: "Evidencia disponible",
  EVIDENCIA_NO_COMPATIBLE: "Evidencia publicada, no compatible con este perfil",
  NO_DETERMINABLE: "Falta un dato para poder comparar",
  NO_COMPARABLE: "Falta declarar cómo se midió",
  SIN_EVIDENCIA_UTILIZABLE: "Sin referencia utilizable",
};

export default function EvidenceBlock({
  evidencia,
  observado,
  unidad,
  normativaCubierta,
}: Props) {
  const frase = redactar(evidencia);
  const principal = evidencia.compatibles[0] ?? null;

  // Cuando la NKB ya contestó, aquí solo queda lo que la complementa. Sin
  // fiabilidad ni error de medida que aportar, el bloque no se dibuja: una
  // sección vacía con un título es ruido.
  if (normativaCubierta && evidencia.complementarias.length === 0) return null;

  return (
    <section
      className="pas10e-evidencia border-t border-white/[0.06] pt-3"
      data-estado={evidencia.estado}
      aria-label="Evidencia"
    >
      <p className="text-[11px] uppercase tracking-wider text-white/35">
        {normativaCubierta ? "Evidencia complementaria" : TITULO[evidencia.estado]}
      </p>

      {/* La escala solo se dibuja cuando la NKB no ha contestado ya y hay una
          representación real detrás. Un gráfico sin datos suficientes es peor
          que ningún gráfico. */}
      {!normativaCubierta && principal !== null ? (
        <div className="mt-3">
          <EvidenceScale
            representacion={principal.referencia.representacion}
            posicion={principal.posicion}
            observado={observado}
            unidad={unidad}
          />
        </div>
      ) : null}

      {!normativaCubierta ? (
        <p className="mt-1 text-sm leading-relaxed text-white/70">{frase.texto}</p>
      ) : null}

      {/* La población de la referencia, en lenguaje corriente. Nunca el código
          de la norma: eso vive en los detalles técnicos. */}
      {!normativaCubierta && principal !== null ? (
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[11px]">
          <dt className="text-white/35">Referencia</dt>
          <dd className="text-white/60">{poblacionLegible(principal.referencia)}</dd>
          {frase.procedencia ? (
            <>
              <dt className="text-white/35">Fuente</dt>
              <dd className="text-white/60">{frase.procedencia}</dd>
            </>
          ) : null}
        </dl>
      ) : null}

      {/* La fiabilidad de la prueba, cuando la hay. Va SIEMPRE en su propio
          sitio y nunca junto a la posición: describe el instrumento, no al
          atleta, y mezclarlas invita a leer un ICC alto como un buen resultado. */}
      {evidencia.complementarias.map((r) => (
        <div key={r.id} className="mt-3">
          <p className="mb-1 text-[11px] uppercase tracking-wider text-white/30">
            Fiabilidad de la prueba
          </p>
          <EvidenceScale
            representacion={r.representacion}
            posicion={null}
            observado={observado}
            unidad={unidad}
          />
        </div>
      ))}

      {/* Qué falta. Es la parte que convierte un callejón sin salida en una
          tarea concreta, así que no se abrevia. */}
      {!normativaCubierta && frase.limite ? (
        <p className="mt-2 text-[11px] leading-relaxed text-white/40">{frase.limite}</p>
      ) : null}
    </section>
  );
}

/** «Varones de 18 a 35 años, en competición». Nunca un identificador. */
function poblacionLegible(ref: LecturaEvidencia["compatibles"][number]["referencia"]): string {
  const partes: string[] = [];
  if (ref.ambito.pais !== null) partes.push(ref.ambito.pais);
  if (ref.ambito.sexo !== null) partes.push(ref.ambito.sexo === "M" ? "Varones" : "Mujeres");
  if (ref.ambito.edadMin !== null && ref.ambito.edadMax !== null) {
    partes.push(`${ref.ambito.edadMin}-${ref.ambito.edadMax} años`);
  }
  if (ref.ambito.contexto === "competicion") partes.push("competición");
  if (ref.ambito.contexto === "escolar") partes.push("edad escolar");
  return partes.length > 0 ? partes.join(" · ") : "Población general";
}
