import { ORIENTACIONES } from "@/lib/bcs/orientacion";

// ── Orientación por objetivo (Sprint BCS-9.0) ──────────────────────────────
//
// La respuesta a «no me recomienda nada». Y la forma es la que la propia base
// de conocimiento permite: indexada POR OBJETIVO, no por valor.
//
// La cadena «tu número está mal → esto es un riesgo → haz esto» exige
// clasificar con un rango que no existe, emitir un juicio de salud que el
// handbook prohíbe, y atribuir al dato una causa que —lo repite cada ficha de
// la CKB— el dato no contiene.
//
// La cadena «para esto que quieres conseguir, esto es lo que la evidencia
// señala» no necesita ninguna de las tres cosas, y es lo que un profesional
// hace de todos modos. El objetivo lo pone él; la evidencia la pone la CKB.
//
// Cada punto viaja con su ficha, su nivel de evidencia y sus referencias. Y
// con lo que esa misma ficha declara NO admisible, que va dentro y no en una
// nota al pie: es la parte que impide leer la orientación como una promesa.

export default function GuidanceSection() {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm leading-relaxed text-white/55">
        Lo que sigue no se deduce de tus cifras: se organiza por objetivo. La composición corporal
        describe un estado, y qué hacer con él depende de una meta que el dato no contiene. Cada
        punto cita la ficha y los estudios que lo sostienen.
      </p>

      {ORIENTACIONES.map((o) => (
        <article
          key={o.objetivo}
          data-objetivo={o.objetivo}
          className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5"
        >
          <h4 className="text-sm font-bold text-white/90">{o.titulo}</h4>
          <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-white/55">
            {o.definicion}
          </p>

          <ul className="mt-4 space-y-2">
            {o.palancas.map((p) => (
              <li
                key={p}
                className="border-l-2 border-orange-500/40 pl-3 text-[13px] leading-relaxed text-white/75"
              >
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[12px] leading-relaxed text-white/50">
            <span className="font-semibold text-white/65">Qué esperar. </span>
            {o.expectativa}
          </p>

          <div className="mt-4 border-t border-white/[0.06] pt-3">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              Qué no puede concluirse
            </p>
            <ul className="space-y-1">
              {o.noAdmisible.map((x) => (
                <li key={x} className="text-[11px] leading-relaxed text-white/40">
                  · {x}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-3 text-[9px] leading-relaxed text-white/25">
            {o.fuente.modulo} · ficha {o.fuente.ficha} · evidencia {o.fuente.nivelEvidencia} · ref:{" "}
            {o.fuente.referencias.join(", ")}
          </p>
        </article>
      ))}
    </div>
  );
}
