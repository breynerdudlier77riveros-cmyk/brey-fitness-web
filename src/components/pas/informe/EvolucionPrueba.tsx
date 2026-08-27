import { valorDe, type SeriePrueba } from "@/features/performance-workspace/services/series";

// ── La evolución de una prueba (Sprint PAS-14) ─────────────────────────────
//
// «¿Mejoré o empeoré?» es la primera pregunta de cualquier atleta, y hasta
// ahora se contestaba con un par de números dentro de una tarjeta. Una línea
// la contesta de un vistazo.
//
// ── LA FORMA ──────────────────────────────────────────────────────────────
//
//   Cambio a lo largo del tiempo → línea. Las fechas son un continuo ordenado,
//   no categorías, así que la pendiente entre dos puntos significa algo.
//
//   UNA sola serie: el color no distingue nada y por eso no hay leyenda —el
//   título ya dice qué se está viendo. Los ejes van recesivos y el valor va
//   escrito sobre cada punto: con cuatro o cinco fechas, leerlo directamente
//   es más rápido que estimarlo contra una rejilla que aquí ni existe.
//
// ── DONDE LOS DATOS SE CONTRADICEN, LA LÍNEA SE ROMPE ─────────────────────
//
//   Es la decisión que hace honesto este gráfico. Si una fecha tiene varios
//   valores distintos —cuatro 1RM el mismo día— la tentación es elegir uno y
//   dibujar una línea limpia. Sería mentir con un gráfico, que es la peor
//   forma de mentir: una línea ascendente convence sin que nadie la mire con
//   cuidado.
//
//   Así que ese punto se dibuja con TODOS sus valores, en hueco, y la línea no
//   lo atraviesa. El hueco en la línea es la información.
//
// ── NO INTERPRETA ─────────────────────────────────────────────────────────
//
//   No dice si subir es mejorar. En 1RM subir es mejorar; en un tiempo de
//   sprint es empeorar; y en varias pruebas del catálogo depende del objetivo.
//   El gráfico enseña la dirección y quien lo lee sabe lo que significa —el
//   sistema no lo sabe y no lo finge.
//
// Componente de servidor. SVG en línea: sin librería e imprime nítido.

interface Props {
  serie: SeriePrueba;
  nombre: string;
}

const ANCHO = 100;
const ALTO = 42;
const MARGEN_X = 6;
const TECHO = 7;
const SUELO = ALTO - 8;

/** Coma decimal y sin decimales inútiles. */
const num = (v: number): string =>
  (Number.isInteger(v) ? String(v) : v.toFixed(1)).replace(".", ",");

/** «2026-08-15» → «15 ago». El año se omite: la serie cabe en una temporada. */
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function fechaCorta(iso: string): string {
  const [, m, d] = iso.split("-");
  const mes = MESES[Number(m) - 1] ?? m;
  return `${Number(d)} ${mes}`;
}

export default function EvolucionPrueba({ serie, nombre }: Props) {
  if (serie.bloqueo !== null) {
    return (
      <div className="rounded-lg border border-white/[0.08] p-3">
        <p className="text-[12px] font-semibold text-white/70">{nombre}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white/45">{serie.bloqueo}</p>
      </div>
    );
  }

  // Con un solo punto no hay evolución que dibujar, y decirlo vale más que un
  // gráfico de un punto: es la diferencia entre «no ha cambiado» y «todavía no
  // hay con qué compararlo».
  if (serie.puntos.length < 2) {
    return (
      <div className="rounded-lg border border-white/[0.08] p-3">
        <p className="text-[12px] font-semibold text-white/70">{nombre}</p>
        <p className="mt-1 text-[11px] text-white/45">
          Una sola medición. Hará falta otra fecha para poder ver evolución.
        </p>
      </div>
    );
  }

  const todos = serie.puntos.flatMap((p) => p.valores);
  const min = Math.min(...todos);
  const max = Math.max(...todos);
  // Un rango de cero (todos los valores iguales) dividiría por cero. Se abre
  // un margen artificial y la línea sale plana, que es lo correcto.
  const rango = max - min || Math.abs(max) || 1;

  const x = (i: number) =>
    MARGEN_X + (i * (ANCHO - MARGEN_X * 2)) / Math.max(1, serie.puntos.length - 1);
  const y = (v: number) => SUELO - ((v - min) / rango) * (SUELO - TECHO);

  // La línea se parte en tramos: cada corte es una fecha ambigua. `null` no se
  // interpola —interpolar sería inventar el valor que falta.
  const tramos: { i: number; v: number }[][] = [];
  let actual: { i: number; v: number }[] = [];
  serie.puntos.forEach((p, i) => {
    const v = valorDe(p);
    if (v === null) {
      if (actual.length > 0) tramos.push(actual);
      actual = [];
      return;
    }
    actual.push({ i, v });
  });
  if (actual.length > 0) tramos.push(actual);

  const hayAmbiguo = serie.puntos.some((p) => p.ambiguo);

  return (
    <figure className="rounded-lg border border-white/[0.08] p-3">
      <figcaption className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-[12px] font-semibold text-white/75">{nombre}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/30">{serie.unidad}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        role="img"
        aria-label={`Evolución de ${nombre}. ${serie.puntos
          .map((p) => `${p.fecha}: ${p.valores.map(num).join(" o ")} ${serie.unidad}`)
          .join(". ")}`}
        className="w-full"
      >
        <line
          x1="0"
          y1={SUELO}
          x2={ANCHO}
          y2={SUELO}
          stroke="currentColor"
          strokeWidth="0.25"
          className="text-white/15"
        />

        {tramos.map((tramo, t) =>
          tramo.length < 2 ? null : (
            <polyline
              key={t}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-400/80"
              points={tramo.map((p) => `${x(p.i)},${y(p.v)}`).join(" ")}
            />
          ),
        )}

        {serie.puntos.map((p, i) => (
          <g key={p.fecha}>
            {p.valores.map((v, j) => (
              <circle
                key={j}
                cx={x(i)}
                cy={y(v)}
                r={1.5}
                // En hueco cuando el punto es ambiguo: el relleno se reserva
                // para el dato del que uno se puede fiar.
                className={p.ambiguo ? "fill-slate-950 stroke-yellow-400/80" : "fill-orange-400"}
                strokeWidth={p.ambiguo ? 0.6 : 0}
              />
            ))}

            {/* El valor, escrito. Si el punto es ambiguo se escriben todos. */}
            <text
              x={x(i)}
              y={y(Math.max(...p.valores)) - 2}
              textAnchor="middle"
              fill="currentColor"
              className={p.ambiguo ? "text-yellow-200/90" : "text-white/60"}
              style={{ fontSize: "3.2px", fontWeight: 700 }}
            >
              {p.valores.map(num).join(" / ")}
            </text>

            <text
              x={x(i)}
              y={ALTO - 1.5}
              textAnchor="middle"
              fill="currentColor"
              className="text-white/30"
              style={{ fontSize: "3px", fontWeight: 600 }}
            >
              {fechaCorta(p.fecha)}
            </text>
          </g>
        ))}
      </svg>

      {hayAmbiguo ? (
        <p className="mt-1 text-[11px] leading-relaxed text-yellow-200/70">
          La línea se corta donde hay varios valores de la misma fecha: no se elige uno, así que
          ahí no hay evolución que trazar.
        </p>
      ) : null}
    </figure>
  );
}
