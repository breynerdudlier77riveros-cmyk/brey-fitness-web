import type { GrupoDominio, ResultadoHumano } from "@/lib/pas/informe-humano";

// ── Perfil de rendimiento (Sprint PAS-10F) ─────────────────────────────────
//
// LO QUE NO HAY AQUÍ, Y ES LA DECISIÓN QUE DEFINE EL COMPONENTE:
//
//   Ninguna puntuación global. Ningún «Performance Score 82/100». Ninguna
//   media entre dominios.
//
//   Promediar fuerza, movilidad y resistencia exigiría un peso para cada una,
//   y ese peso no existe publicado en ninguna parte. El número saldría de una
//   decisión de producto disfrazada de medida — y una vez impreso, nadie
//   volvería a mirar de dónde salió.
//
//   El perfil es MULTIDIMENSIONAL a propósito: se lee por dominios, y cada
//   prueba conserva su propia respuesta.
//
// LOS TRES EJES SE LEEN POR SEPARADO. Cada fila muestra si esa prueba tiene
// referencia, evolución y objetivo como TRES columnas independientes. Un
// atleta puede tener evolución sin referencia, u objetivo sin ninguna de las
// dos, y esa combinación es información: dice qué se puede concluir hoy.
//
// La taxonomía es la que ya existe en `capacidades.ts`. No se inventa ninguna.

interface Props {
  dominios: readonly GrupoDominio[];
}

/** Qué se puede decir de esta prueba en cada eje. Sin cruzarlos. */
function ejesDe(r: ResultadoHumano) {
  return {
    // La NKB manda donde llega; la capa de evidencia cubre el resto. La
    // precedencia ya está resuelta en la composición, aquí solo se lee.
    normativo: r.fuenteNormativa !== "ninguna",
    longitudinal: r.tendencia.disponible,
    objetivo: r.objetivo.disponible,
  };
}

/**
 * Qué falta, en una palabra, cuando no hay referencia.
 *
 * Los seis estados no se colapsan: cada uno dice algo distinto sobre qué hacer
 * a continuación, y «—» a secas devolvería el informe al problema que este
 * sprint corrige.
 */
const FALTA: Readonly<Record<ResultadoHumano["evidencia"]["estado"], string>> = {
  EVIDENCIA_COMPATIBLE: "",
  EVIDENCIA_PARCIAL: "por cargar",
  EVIDENCIA_NO_COMPATIBLE: "otro perfil",
  NO_DETERMINABLE: "falta un dato",
  NO_COMPARABLE: "falta el método",
  SIN_EVIDENCIA_UTILIZABLE: "sin referencia",
};

/** Coma decimal. Solo presentación. */
const num = (v: number): string => v.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");

function Marca({ activo, ausente }: { activo: boolean; ausente: string }) {
  return activo ? (
    <span className="text-white/70" aria-label="disponible">
      ✓
    </span>
  ) : (
    <span className="text-[10px] text-white/30">{ausente || "—"}</span>
  );
}

export default function PerformanceProfile({ dominios }: Props) {
  if (dominios.length === 0) return null;

  return (
    <section
      data-seccion="perfil"
      aria-label="Perfil de rendimiento"
      className="pas10f-perfil"
    >
      <h2 className="mb-1 text-[11px] uppercase tracking-wider text-white/40">
        Perfil de rendimiento
      </h2>
      <p className="mb-4 max-w-[62ch] text-[11px] leading-relaxed text-white/35">
        Cada prueba conserva su propia lectura. No se promedian entre sí: no existe un peso
        publicado que permita combinar fuerza, movilidad y resistencia en una sola cifra.
      </p>

      <div className="space-y-5">
        {dominios.map((d) => (
          <div key={d.id} className="pas10f-dominio" data-dominio={d.id}>
            <div className="mb-2 flex items-baseline gap-3 border-b border-white/[0.08] pb-1.5">
              <h3 className="text-sm font-semibold text-white/80">{d.nombre}</h3>
              <span className="text-[11px] text-white/35">
                {d.resultados.length} {d.resultados.length === 1 ? "prueba" : "pruebas"}
              </span>
            </div>

            {/* Tabla en escritorio, tarjetas apiladas en móvil. La escala nunca
                se rompe en horizontal: en pantalla estrecha desaparece la
                rejilla, no el dato. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-white/30">
                    <th className="py-1 text-left font-medium">Prueba</th>
                    <th className="py-1 text-right font-medium">Resultado</th>
                    <th className="w-24 py-1 text-center font-medium">Referencia</th>
                    <th className="w-24 py-1 text-center font-medium">Evolución</th>
                    <th className="w-20 py-1 text-center font-medium">Objetivo</th>
                  </tr>
                </thead>
                <tbody>
                  {d.resultados.map((r, i) => {
                    const ejes = ejesDe(r);
                    return (
                      <tr
                        key={`${r.pruebaId}-${i}`}
                        className="border-t border-white/[0.04]"
                        data-prueba={r.pruebaId}
                      >
                        {/* El nombre humano, nunca el código. El identificador
                            viaja en `data-prueba` para las pruebas automáticas
                            y para el profesional, no como texto legible. */}
                        <td className="py-1.5 pr-3 text-white/75">{r.nombre}</td>
                        <td className="py-1.5 text-right tabular-nums whitespace-nowrap text-white/85">
                          {num(r.valorObservado)}
                          <span className="ml-1 text-[11px] text-white/40">{r.unidad}</span>
                        </td>
                        <td className="py-1.5 text-center">
                          <Marca activo={ejes.normativo} ausente={FALTA[r.evidencia.estado]} />
                        </td>
                        <td className="py-1.5 text-center">
                          <Marca activo={ejes.longitudinal} ausente="" />
                        </td>
                        <td className="py-1.5 text-center">
                          <Marca activo={ejes.objetivo} ausente="" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
