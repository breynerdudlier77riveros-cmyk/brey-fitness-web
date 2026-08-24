import type { EjercicioPlantilla } from "@/lib/plantillas/tipos";

// ── La rejilla semanas × series ────────────────────────────────────────────
//
// LA PIEZA QUE EL ENTRENADOR PEDÍA, Y LA DECISIÓN QUE LA HACE LEGIBLE.
//
//   Las columnas son SEMANAS y las filas son SERIES. Al revés —una fila por
//   semana— la progresión de una misma serie quedaría repartida verticalmente
//   entre celdas de distinta altura, y la progresión es justo lo que se viene
//   a mirar. Así, seguir una serie a lo largo del bloque es leer una fila.
//
//   El referente que trajo el entrenador amontonaba las series dentro de una
//   celda por semana, en texto corrido. Aquí cada serie tiene su fila y cada
//   dato su columna, que es lo que pidió cuando dijo «más estructurado».
//
// ── LOS TRES DATOS SE MUESTRAN SOLO SI EXISTEN ────────────────────────────
//
//   Una serie sin carga prescrita no pinta «0 kg» ni «—»: no pinta nada. Es
//   la misma regla que el resto del ecosistema aplica a los datos ausentes, y
//   aquí importa igual — «0 kg» se lee como una indicación de descarga, y
//   nadie la escribió.
//
//   Si el bloque entero no lleva carga ni RIR, esas columnas desaparecen en
//   vez de quedarse vacías: una tabla con dos tercios en blanco parece rota.
//
// Componente de servidor: solo pinta lo que recibe.

interface Props {
  ejercicio: EjercicioPlantilla;
  semanas: number;
}

/** Coma decimal, y sin decimales cuando no hacen falta. */
const kg = (v: number): string =>
  (Number.isInteger(v) ? String(v) : v.toFixed(1)).replace(".", ",");

export default function WeekGrid({ ejercicio, semanas }: Props) {
  // Cuántas filas hace falta: la serie más larga de todas las semanas. Un
  // bloque puede subir de 3 a 4 series a mitad del ciclo.
  const filas = Math.max(1, ...ejercicio.semanas.map((s) => s.series.length));

  const todas = ejercicio.semanas.flatMap((s) => s.series);
  const hayPeso = todas.some((s) => s.pesoKg !== null);
  const hayRir = todas.some((s) => s.rir !== null);
  const columnas = 1 + (hayPeso ? 1 : 0) + (hayRir ? 1 : 0);

  return (
    // Desbordamiento propio: con 24 semanas la tabla es ancha, y el que
    // scrolle la tabla y no la página es lo que mantiene el resto legible.
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-max border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-slate-950 pr-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30 print:bg-white"
            >
              Serie
            </th>
            {Array.from({ length: semanas }, (_, i) => (
              <th
                key={i}
                scope="col"
                colSpan={columnas}
                className="border-l border-white/[0.07] px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40"
              >
                Semana {i + 1}
              </th>
            ))}
          </tr>
          <tr>
            <th className="sticky left-0 z-10 bg-slate-950 print:bg-white" />
            {Array.from({ length: semanas }, (_, i) => (
              <SubCabecera key={i} hayPeso={hayPeso} hayRir={hayRir} />
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: filas }, (_, iFila) => (
            <tr key={iFila} className="align-top">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-slate-950 pr-3 py-1 text-[11px] font-semibold text-white/35 print:bg-white"
              >
                {iFila + 1}
              </th>

              {Array.from({ length: semanas }, (_, iSemana) => {
                const serie = ejercicio.semanas[iSemana]?.series[iFila];
                // Sin serie en esta semana: la celda queda vacía. Repetir la
                // de al lado inventaría una prescripción.
                return (
                  <Celda
                    key={iSemana}
                    reps={serie?.reps ?? ""}
                    peso={serie?.pesoKg ?? null}
                    rir={serie?.rir ?? null}
                    hayPeso={hayPeso}
                    hayRir={hayRir}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubCabecera({ hayPeso, hayRir }: { hayPeso: boolean; hayRir: boolean }) {
  const clase = "px-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-white/25";
  return (
    <>
      <th scope="col" className={`${clase} border-l border-white/[0.07]`}>
        reps
      </th>
      {hayPeso && (
        <th scope="col" className={clase}>
          kg
        </th>
      )}
      {hayRir && (
        <th scope="col" className={clase} title="Repeticiones en reserva">
          RIR
        </th>
      )}
    </>
  );
}

function Celda({
  reps,
  peso,
  rir,
  hayPeso,
  hayRir,
}: {
  reps: string;
  peso: number | null;
  rir: number | null;
  hayPeso: boolean;
  hayRir: boolean;
}) {
  const base = "px-3 py-1 text-[13px] tabular-nums";
  return (
    <>
      <td className={`${base} border-l border-white/[0.07] font-semibold text-white`}>
        {reps.trim() === "" ? <span className="text-white/15">·</span> : reps}
      </td>
      {hayPeso && (
        <td className={`${base} text-white/70`}>
          {peso === null ? <span className="text-white/15">·</span> : kg(peso)}
        </td>
      )}
      {hayRir && (
        <td className={`${base} text-white/45`}>
          {rir === null ? <span className="text-white/15">·</span> : rir}
        </td>
      )}
    </>
  );
}
