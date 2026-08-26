import type { EjercicioPlantilla } from "@/lib/plantillas/tipos";

// ── La rejilla semanas × series ────────────────────────────────────────────
//
// LA DECISIÓN QUE LA HACE LEGIBLE.
//
//   Las columnas son SEMANAS y las filas son SERIES. Al revés —una fila por
//   semana— la progresión de una misma serie quedaría repartida verticalmente
//   entre celdas de distinta altura, y la progresión es justo lo que se viene
//   a mirar. Así, seguir una serie a lo largo del bloque es leer una fila.
//
//   El referente que trajo el entrenador amontonaba las series dentro de una
//   celda por semana, en texto corrido. Aquí cada serie tiene su fila y cada
//   dato su columna.
//
// ── LAS TRES COLUMNAS VAN SIEMPRE ─────────────────────────────────────────
//
//   Antes reps/kg/RIR aparecían solo si algún dato existía. Parecía elegante y
//   era un fallo: un entrenador que no había rellenado ningún RIR no veía la
//   columna, y concluyó —con razón— que el sistema no tenía RIR. Una casilla
//   que se esconde cuando está vacía no se puede rellenar nunca.
//
//   Además las columnas condicionales hacían que dos ejercicios del mismo día
//   tuvieran anchos distintos, y una lista de tablas desalineadas se lee peor
//   que una tabla con huecos.
//
//   El hueco se dibuja como un punto tenue: no es cero, es «no prescrito», y
//   un cero se leería como una indicación que nadie escribió.
//
// ── SEMANAS ALTERNAS EN BANDAS ────────────────────────────────────────────
//
//   Con más de tres semanas y tres columnas cada una, el ojo pierde de qué
//   semana es la celda que está mirando. Las bandas alternas lo resuelven sin
//   añadir una sola línea más: es agrupación por fondo, no por rejilla.
//
// Componente de servidor: solo pinta lo que recibe.

interface Props {
  ejercicio: EjercicioPlantilla;
  semanas: number;
}

/** Coma decimal, y sin decimales cuando no hacen falta. */
const kg = (v: number): string =>
  (Number.isInteger(v) ? String(v) : v.toFixed(1)).replace(".", ",");

/** El hueco. Nunca un cero. */
const Vacio = () => (
  <span data-vacio className="text-white/15">
    ·
  </span>
);

export default function WeekGrid({ ejercicio, semanas }: Props) {
  // Cuántas filas hace falta: la serie más larga de todas las semanas. Un
  // bloque puede subir de 3 a 4 series a mitad del ciclo.
  const filas = Math.max(1, ...ejercicio.semanas.map((s) => s.series.length));

  return (
    // Desbordamiento propio: con 24 semanas la tabla es ancha, y que scrollee
    // la tabla y no la página es lo que mantiene el resto legible. En papel la
    // hoja de impresión abre este overflow para que no recorte nada.
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-max border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-slate-950 pb-1.5 pr-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30 print:bg-transparent"
            >
              <span className="sr-only">Número de </span>Serie
            </th>
            {Array.from({ length: semanas }, (_, i) => (
              <th
                key={i}
                scope="col"
                colSpan={3}
                data-banda={i % 2 === 1 ? "" : undefined}
                className={`px-2 pb-1 pt-0.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] ${
                  i % 2 === 1 ? "bg-white/[0.03]" : ""
                } ${i === 0 ? "rounded-tl-md" : ""} ${
                  i === semanas - 1 ? "rounded-tr-md" : ""
                } text-white/45`}
              >
                Semana {i + 1}
              </th>
            ))}
          </tr>
          <tr>
            <th className="sticky left-0 z-10 bg-slate-950 print:bg-transparent" />
            {Array.from({ length: semanas }, (_, i) => (
              <SubCabecera key={i} banda={i % 2 === 1} />
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: filas }, (_, iFila) => (
            <tr key={iFila} className="align-top">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-slate-950 py-1 pr-3 text-[11px] font-bold text-white/30 print:bg-transparent"
              >
                {iFila + 1}
              </th>

              {Array.from({ length: semanas }, (_, iSemana) => {
                const serie = ejercicio.semanas[iSemana]?.series[iFila];
                // Sin serie en esta semana la celda queda vacía. Repetir la de
                // al lado inventaría una prescripción.
                return (
                  <Celda
                    key={iSemana}
                    reps={serie?.reps ?? ""}
                    peso={serie?.pesoKg ?? null}
                    rir={serie?.rir ?? null}
                    banda={iSemana % 2 === 1}
                    ultimaFila={iFila === filas - 1}
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

function SubCabecera({ banda }: { banda: boolean }) {
  const base = `px-2 pb-1.5 text-center text-[9px] font-semibold uppercase tracking-wider text-white/25 ${
    banda ? "bg-white/[0.03]" : ""
  }`;
  return (
    <>
      <th scope="col" data-banda={banda ? "" : undefined} className={base}>
        reps
      </th>
      <th scope="col" data-banda={banda ? "" : undefined} className={base}>
        kg
      </th>
      {/* `title` y no solo las siglas: quien lee el PDF puede no saber qué es
          un RIR, y la leyenda del pie lo explica una vez para todo el
          documento. */}
      <th
        scope="col"
        data-banda={banda ? "" : undefined}
        className={base}
        title="Repeticiones en reserva"
      >
        RIR
      </th>
    </>
  );
}

function Celda({
  reps,
  peso,
  rir,
  banda,
  ultimaFila,
}: {
  reps: string;
  peso: number | null;
  rir: number | null;
  banda: boolean;
  ultimaFila: boolean;
}) {
  const base = `px-2 py-1 text-center text-[13px] tabular-nums ${banda ? "bg-white/[0.03]" : ""} ${
    ultimaFila ? "pb-1.5" : ""
  }`;
  return (
    <>
      <td data-banda={banda ? "" : undefined} className={`${base} font-bold text-white`}>
        {reps.trim() === "" ? <Vacio /> : reps}
      </td>
      <td data-banda={banda ? "" : undefined} className={`${base} text-white/65`}>
        {peso === null ? <Vacio /> : kg(peso)}
      </td>
      <td data-banda={banda ? "" : undefined} className={`${base} text-white/45`}>
        {rir === null ? <Vacio /> : rir}
      </td>
    </>
  );
}
