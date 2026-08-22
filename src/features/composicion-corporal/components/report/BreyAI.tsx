import PreguntarIA from "./PreguntarIA";
import type { Entregable } from "@/lib/bcs/copilot";
import type { EntradaContexto } from "@/lib/bcs/ia/contexto";

// ── BREY IA · lo que el sistema sabe decir de este informe (BCS-11) ────────
//
// LO QUE ESTO ES, Y LO QUE NO. Con el nombre por delante, porque la etiqueta
// «IA» promete algo concreto y aquí hay otra cosa:
//
//   Todo el texto que sigue está COMPUESTO, no generado. Sale de plantillas
//   escritas a mano que reordenan lo que los motores concluyeron, y cada una
//   cita sus hallazgos. Misma medición → mismo texto, siempre, palabra por
//   palabra.
//
//   Eso NO es una limitación disimulada: es lo que permite que un informe
//   clínico sea auditable. Un texto generado por un modelo de lenguaje no
//   podría llevar la traza que estos llevan, y no podría garantizarse que dos
//   lecturas del mismo dato digan lo mismo.
//
//   Lo que todavía NO hace: responder preguntas abiertas. Para eso hace falta
//   un modelo de lenguaje, y el módulo del copiloto ya tiene preparado el
//   punto donde entraría (`copilot/prompts.ts` y `render.ts`). Mientras no
//   exista, este apartado no finge tenerlo.
//
// Se llama por su nombre y va arriba porque el profesional preguntó por él, y
// porque estaba escrito desde BCS-6.0 sin que ninguna pantalla lo mostrara.

interface Props {
  /** La explicación en lenguaje corriente, ya compuesta. */
  entregable: Entregable | null;
  /** Cuántos documentos más hay disponibles para este informe. */
  documentosDisponibles?: number;
  /**
   * Lo que el modelo necesita para responder preguntas (BCS-12).
   *
   * Opcional: sin él el bloque se dibuja igual y no ofrece conversación. Las
   * vistas que no deben conversar —la pública, por ejemplo— simplemente no lo
   * pasan, y no hay nada que desactivar.
   */
  contextoIA?: EntradaContexto;
}

export default function BreyAI({ entregable, documentosDisponibles = 0, contextoIA }: Props) {
  if (entregable === null) return null;

  return (
    <section
      aria-labelledby="brey-ia"
      className="bcs-brey-ia overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-b from-orange-500/[0.07] to-transparent"
    >
      <div className="border-b border-orange-500/15 px-5 py-4 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400/90">
          ● BREY IA
        </p>
        <h2 id="brey-ia" className="mt-1 text-lg font-black text-white">
          Qué dicen tus resultados
        </h2>
        <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-white/40">
          Texto compuesto a partir de lo que el análisis concluyó, no generado libremente: la misma
          medición produce siempre el mismo texto, y cada frase puede rastrearse hasta su hallazgo.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {entregable.secciones.map((seccion, i) => (
          <div key={seccion.titulo || `s-${i}`}>
            {seccion.titulo ? (
              <h3 className="mb-1.5 text-sm font-bold text-white/85">{seccion.titulo}</h3>
            ) : null}
            <div className="space-y-2">
              {seccion.contenido.map((linea, j) => (
                <p key={`${i}-${j}`} className="max-w-2xl text-sm leading-relaxed text-white/75">
                  {linea}
                </p>
              ))}
            </div>
          </div>
        ))}

        {documentosDisponibles > 0 ? (
          <p className="border-t border-white/[0.07] pt-4 text-[11px] leading-relaxed text-white/40 print:hidden">
            BREY IA tiene {documentosDisponibles} documentos más listos a partir de este mismo
            informe —resúmenes, guion de consulta, correo, nota clínica— al final de la página.
          </p>
        ) : null}
      </div>

      {contextoIA ? <PreguntarIA contexto={contextoIA} /> : null}
    </section>
  );
}
