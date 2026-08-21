import type { Entregable } from "@/lib/bcs/copilot";

// ── Explicación para el cliente (Sprint BCS-7.0) ───────────────────────────
//
// LA SECCIÓN QUE FALTABA, Y QUE YA ESTABA ESCRITA.
//
//   El informe tenía catorce secciones y las catorce hablaban al profesional:
//   hallazgos, insights, observaciones clínicas, recomendaciones, trazas. La
//   persona que se subió a la báscula no tenía ni un párrafo dirigido a ella.
//
//   El texto existía desde BCS-6.0, en `copilot/plantillas/paciente.ts`, con
//   su suite de tests — y no lo consumía ningún componente. Este fichero es
//   el cable que faltaba, no una redacción nueva.
//
// NO REDACTA NADA. Recibe el entregable ya compuesto y validado por el
// copiloto, que a su vez solo reordena lo que los motores concluyeron. Aquí
// se leen `secciones` y se dibujan.
//
// VA ARRIBA, justo después del resumen ejecutivo. Si fuera al final, el
// cliente tendría que atravesar once secciones de jerga profesional para
// llegar a la única escrita para él, y no llegaría.

interface Props {
  /** `null` cuando el copiloto no pudo componerlo: entonces no se dibuja. */
  entregable: Entregable | null;
}

export default function PatientExplanation({ entregable }: Props) {
  if (entregable === null) return null;

  return (
    <section
      aria-labelledby="explicacion-paciente"
      className="bcs-explicacion rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6"
    >
      <h2 id="explicacion-paciente" className="font-black text-lg text-white">
        Qué dicen tus resultados
      </h2>
      <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-white/40">
        En lenguaje corriente
      </p>

      <div className="mt-5 space-y-5">
        {entregable.secciones.map((seccion, i) => (
          <div key={seccion.titulo || `s-${i}`}>
            {seccion.titulo ? (
              <h3 className="mb-1.5 text-sm font-bold text-white/85">{seccion.titulo}</h3>
            ) : null}
            <div className="space-y-2">
              {seccion.contenido.map((linea, j) => (
                <p
                  key={`${i}-${j}`}
                  className="max-w-2xl text-sm leading-relaxed text-white/70"
                >
                  {linea}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
