import { lecturaLlanaDe, type GrupoDominio, type ResultadoHumano } from "@/lib/pas/informe-humano";

// ── Perfil de rendimiento (Sprints PAS-10F · PAS-13) ───────────────────────
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
// ── QUÉ SE ARREGLÓ EN PAS-13 ──────────────────────────────────────────────
//
// 1 · LA COLUMNA «REFERENCIA» ERA UN ✓ O UN FRAGMENTO CRÍPTICO.
//
//     «por cargar», «otro perfil», «falta un dato». Cada uno abreviaba una
//     frase que nadie podía reconstruir, y el ✓ —el caso bueno— era el que
//     menos decía: confirmaba que existe una comparación sin enseñarla.
//
//     Desde PAS-13 esa lectura ya está redactada en lenguaje llano, así que
//     aquí se enseña. Un perfil que dice «✓» donde puede decir «20–30 de cada
//     100 quedan por debajo» está tirando la respuesta a la basura.
//
// 2 · LA TABLA SE DESPLAZABA EN HORIZONTAL EN UN MÓVIL.
//
//     `min-w-[30rem]` con `overflow-x-auto`: en pantalla estrecha la rejilla
//     no se colapsaba, se arrastraba. Y una frase entera dentro de una celda
//     lo habría empeorado. Ahora son filas apiladas: el nombre y el valor en
//     una línea, la lectura debajo, y la cobertura como etiquetas pequeñas.
//     Se lee igual a 375 px que a 1280 sin arrastrar nada.
//
// LOS TRES EJES SIGUEN SEPARADOS. Un atleta puede tener evolución sin
// referencia, u objetivo sin ninguna de las dos, y esa combinación es
// información: dice qué se puede concluir hoy.
//
// La taxonomía es la que ya existe en `capacidades.ts`. No se inventa ninguna.

interface Props {
  dominios: readonly GrupoDominio[];
}

/**
 * Qué falta, en palabras completas, cuando no hay lectura que enseñar.
 *
 * Los seis estados no se colapsan: cada uno dice algo distinto sobre qué hacer
 * a continuación. Antes eran fragmentos —«otro perfil», «por cargar»— que
 * abreviaban tanto que había que conocer el sistema para descifrarlos, y el
 * informe volvía al problema que estos sprints corrigen.
 */
const FALTA: Readonly<Record<ResultadoHumano["evidencia"]["estado"], string>> = {
  EVIDENCIA_COMPATIBLE: "Hay una referencia, pero no sitúa este valor en una escala",
  EVIDENCIA_PARCIAL: "Referencia verificada, pendiente de cargar en el sistema",
  EVIDENCIA_NO_COMPATIBLE: "La referencia publicada es de otra población",
  NO_DETERMINABLE: "Falta un dato del atleta para poder comparar",
  NO_COMPARABLE: "Falta declarar cómo se midió",
  SIN_EVIDENCIA_UTILIZABLE: "Sin referencia publicada que sitúe este resultado",
};

/** Coma decimal. Solo presentación. */
const num = (v: number): string => v.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");

/** Cobertura de un eje. Etiqueta, no icono: un ✓ suelto no dice de qué. */
function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.10] bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/45">
      {children}
    </span>
  );
}

function Fila({ resultado: r }: { resultado: ResultadoHumano }) {
  const llano = lecturaLlanaDe(r);

  return (
    <li
      className="border-t border-white/[0.05] py-2.5 first:border-t-0"
      data-prueba={r.pruebaId}
      data-fuente={r.fuenteNormativa}
    >
      {/* El nombre humano, nunca el código. El identificador viaja en
          `data-prueba` para las pruebas automáticas y para el profesional,
          no como texto legible. */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-white/75">{r.nombre}</p>
        <p className="shrink-0 text-sm tabular-nums whitespace-nowrap text-white/85">
          {num(r.valorObservado)}
          <span className="ml-1 text-[11px] text-white/40">{r.unidad}</span>
        </p>
      </div>

      {/* La lectura, o el motivo de que no la haya. Nunca un guion mudo: las
          dos respuestas informan, y la segunda dice qué desbloquearía la
          primera. */}
      <p className="mt-0.5 text-[11px] leading-relaxed text-white/45">
        {llano !== null ? llano.resumen : FALTA[r.evidencia.estado]}
      </p>

      {(r.tendencia.disponible || r.objetivo.disponible) && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {r.tendencia.disponible ? <Etiqueta>Con medición anterior</Etiqueta> : null}
          {r.objetivo.disponible ? <Etiqueta>Con objetivo</Etiqueta> : null}
        </div>
      )}
    </li>
  );
}

export default function PerformanceProfile({ dominios }: Props) {
  if (dominios.length === 0) return null;

  return (
    <section data-seccion="perfil" aria-label="Perfil de rendimiento" className="pas10f-perfil">
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
            <div className="mb-1 flex items-baseline gap-3 border-b border-white/[0.08] pb-1.5">
              <h3 className="text-sm font-semibold text-white/80">{d.nombre}</h3>
              <span className="text-[11px] text-white/35">
                {d.resultados.length} {d.resultados.length === 1 ? "prueba" : "pruebas"}
                {" · "}
                {d.conReferencia} con referencia
              </span>
            </div>

            <ul>
              {d.resultados.map((r, i) => (
                <Fila key={`${r.pruebaId}-${i}`} resultado={r} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
