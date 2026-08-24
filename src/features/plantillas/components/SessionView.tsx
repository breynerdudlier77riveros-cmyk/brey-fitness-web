import Link from "next/link";

import WeekGrid from "./WeekGrid";
import { ETIQUETA_BLOQUE, type Bloque, type Contenido, type Dia } from "@/lib/plantillas/tipos";
import { seriesEnSemana, tonelajeSemana } from "@/lib/plantillas/contenido";

// ── El documento, en pantalla y en papel ───────────────────────────────────
//
// Un solo componente para las tres salidas: la vista pública, la
// previsualización del editor y la impresión. No son tres maquetaciones
// parecidas — es la misma, y por eso no pueden divergir.
//
// ── LO QUE ESTE COMPONENTE NO HACE ────────────────────────────────────────
//
//   No calcula nada que sea una recomendación. El único número derivado que
//   aparece es el tonelaje semanal, que es aritmética pura (peso × reps) y va
//   siempre con cuántas series quedaron fuera de la suma. Un total limpio
//   sobre datos incompletos es peor que ningún total: parece exacto.
//
//   No pinta semáforos ni etiquetas de mérito sobre ninguna cifra. Es la misma
//   línea que el BCS mantiene con las suyas.
//
// ── EL CALENTAMIENTO ES UN BLOQUE, NO UN EJERCICIO CON MENOS PESO ─────────
//
//   Va con su propio encabezado y separado del trabajo principal. En una lista
//   única acaba leído como «lo de arriba», que es exactamente lo que se salta
//   quien tiene prisa.
//
// Componente de servidor.

interface Props {
  contenido: Contenido;
  semanas: number;
  /** Nombre del destinatario, si el enlace está asignado a alguien. */
  para?: string | null;
}

export default function SessionView({ contenido, semanas, para = null }: Props) {
  const dias = contenido.dias;

  if (dias.length === 0) {
    return (
      <p className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-8 text-center text-sm text-white/40">
        Esta plantilla todavía no tiene ningún día.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {para && (
        <p className="text-sm text-white/50">
          Preparada para <span className="font-semibold text-white/80">{para}</span>.
        </p>
      )}

      <ResumenSemanal contenido={contenido} semanas={semanas} />

      {dias.map((dia, i) => (
        <DiaSeccion key={dia.id} dia={dia} indice={i} semanas={semanas} />
      ))}
    </div>
  );
}

// ── Resumen ────────────────────────────────────────────────────────────────

/**
 * Series y tonelaje por semana.
 *
 * Es lo único derivado de todo el documento, y va arriba porque responde a la
 * pregunta que se hace al abrirlo: «¿esto sube o baja?». El tonelaje NO
 * aparece si ninguna serie tiene carga y repeticiones numéricas — una fila de
 * ceros haría creer que el bloque es de descarga.
 */
function ResumenSemanal({ contenido, semanas }: { contenido: Contenido; semanas: number }) {
  const filas = Array.from({ length: semanas }, (_, i) => ({
    semana: i + 1,
    series: seriesEnSemana(contenido, i),
    ...tonelajeSemana(contenido, i),
  }));

  const hayTonelaje = filas.some((f) => f.seriesContadas > 0);
  const incompletas = filas.reduce((n, f) => n + f.seriesSinDatos, 0);

  return (
    <section
      aria-label="Resumen por semana"
      className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
    >
      <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        Por semana
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left tabular-nums">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              <th scope="col" className="pr-6 pb-1.5">
                Semana
              </th>
              <th scope="col" className="pr-6 pb-1.5">
                Series
              </th>
              {hayTonelaje && (
                <th scope="col" className="pb-1.5">
                  Tonelaje
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.semana}>
                <td className="pr-6 py-0.5 text-[13px] font-semibold text-white/70">{f.semana}</td>
                <td className="pr-6 py-0.5 text-[13px] text-white/70">{f.series}</td>
                {hayTonelaje && (
                  <td className="py-0.5 text-[13px] text-white/70">
                    {f.seriesContadas === 0 ? (
                      <span className="text-white/20">·</span>
                    ) : (
                      `${f.kg.toLocaleString("es-ES")} kg`
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hayTonelaje && incompletas > 0 && (
        <p className="mt-3 text-[11px] leading-relaxed text-white/35">
          El tonelaje suma peso × repeticiones y deja fuera{" "}
          {incompletas === 1 ? "una serie" : `${incompletas} series`} sin carga o con un rango de
          repeticiones. No se les asigna un valor: elegir uno inventaría una prescripción que no
          está escrita.
        </p>
      )}
    </section>
  );
}

// ── Día ────────────────────────────────────────────────────────────────────

function DiaSeccion({ dia, indice, semanas }: { dia: Dia; indice: number; semanas: number }) {
  const conEjercicios = dia.bloques.filter((b) => b.ejercicios.length > 0);

  return (
    // `break-inside-avoid` en impresión: un día partido entre dos páginas
    // obliga a pasar hoja a mitad de una serie.
    <section aria-label={dia.nombre} className="print:break-inside-avoid">
      <header className="mb-4 border-b border-white/[0.08] pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-400/70">
          Día {indice + 1}
        </p>
        <h2 className="text-lg font-black text-white">{dia.nombre}</h2>
        {dia.notas && <p className="mt-1 text-sm leading-relaxed text-white/50">{dia.notas}</p>}
      </header>

      {conEjercicios.length === 0 ? (
        <p className="text-sm text-white/30">Sin ejercicios.</p>
      ) : (
        <div className="space-y-6">
          {conEjercicios.map((bloque) => (
            <BloqueSeccion key={bloque.id} bloque={bloque} semanas={semanas} />
          ))}
        </div>
      )}
    </section>
  );
}

function BloqueSeccion({ bloque, semanas }: { bloque: Bloque; semanas: number }) {
  return (
    <div>
      <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {ETIQUETA_BLOQUE[bloque.tipo]}
      </h3>

      <div className="space-y-4">
        {bloque.ejercicios.map((ejercicio) => (
          <article
            key={ejercicio.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 print:break-inside-avoid"
          >
            <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="text-sm font-black text-white">
                {/* El enlace solo aparece si el ejercicio está en el catálogo.
                    Un enlace a una ficha inexistente es peor que ninguno. */}
                {ejercicio.slug ? (
                  <Link
                    href={`/ejercicios/${ejercicio.slug}`}
                    className="underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-orange-400"
                  >
                    {ejercicio.nombre}
                  </Link>
                ) : (
                  ejercicio.nombre
                )}
              </h4>

              {ejercicio.descansoSeg !== null && (
                <p className="text-[11px] text-white/40">
                  Descanso {formatearDescanso(ejercicio.descansoSeg)}
                </p>
              )}
            </div>

            {ejercicio.notas && (
              <p className="mb-2.5 text-[12px] leading-relaxed text-white/45">{ejercicio.notas}</p>
            )}

            <WeekGrid ejercicio={ejercicio} semanas={semanas} />
          </article>
        ))}
      </div>
    </div>
  );
}

/** 90 → «1 min 30 s». Los segundos sueltos no se redondean a minutos. */
function formatearDescanso(seg: number): string {
  if (seg < 60) return `${seg} s`;
  const min = Math.floor(seg / 60);
  const resto = seg % 60;
  return resto === 0 ? `${min} min` : `${min} min ${resto} s`;
}
