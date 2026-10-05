"use client";

import { useMemo } from "react";

import { MARCAS_EJE, coordenada, seriesDeCurva, trazoDeTramo } from "@/lib/macrociclo/curva";
import type { FilaPlan } from "@/lib/macrociclo/tipos";

// ── La curva de volumen e intensidad (Sprint MAC-2) ────────────────────────
//
// El dibujo de abajo del plan gráfico: dos líneas que suben y bajan semana a
// semana. Aquí solo se pinta — el cálculo está en `curva.ts`, que es puro y
// tiene sus tests.
//
// ── VA DENTRO DE LA REJILLA, NO DEBAJO ───────────────────────────────────
//
//   Y es la decisión que hace que sirva de algo. La curva usa las MISMAS
//   variables CSS de ancho de columna que la tabla, así que el pico de la
//   semana 14 cae exactamente bajo la columna 14: se desplaza con ella, se
//   acerca con ella y se imprime con ella.
//
//   Un gráfico aparte, con su propio ancho, obligaría a contar columnas con el
//   dedo para saber a qué semana corresponde cada cresta. Que esté pegado es
//   justo lo que se ve en el plan gráfico de toda la vida.
//
// ── SVG A MANO Y SIN LIBRERÍA ────────────────────────────────────────────
//
//   Son dos `<path>` y seis líneas de retícula. Una librería de gráficos
//   traería su propio sistema de escalas y su propio ancho, que es exactamente
//   lo que hay que evitar: aquí la escala horizontal NO es del gráfico, es la
//   de la rejilla, y tiene que seguirla sin discutir.
//
// ── LOS HUECOS SE VEN ────────────────────────────────────────────────────
//
//   `curva.ts` parte la línea donde falta una semana, y aquí cada tramo es su
//   propio `<path>`. Una semana sin planificar deja un vacío en el dibujo, que
//   es la verdad; unir los dos extremos dibujaría una progresión que nadie
//   escribió.

interface Props {
  filas: readonly FilaPlan[];
  semanas: number;
  /** Alto del lienzo en píxeles, ya multiplicado por el zoom. */
  alto?: number;
}

/** Margen vertical para que el pico y el valle no toquen el borde. */
const MARGEN = 8;

export default function CurvaCarga({ filas, semanas, alto = 150 }: Props) {
  const series = useMemo(() => seriesDeCurva(filas), [filas]);

  if (series.length === 0) {
    return (
      <div className="flex items-center px-3 py-4 text-[11px] italic text-white/25">
        Marca una fila con un color para dibujarla aquí. Volumen e intensidad vienen marcadas de
        serie; la curva aparece en cuanto escribas el primer número.
      </div>
    );
  }

  // El ancho se toma del sistema de la rejilla, no del gráfico. `100` es una
  // escala interna del viewBox: el ancho real lo pone el contenedor con
  // `--ancho-celda`, y `preserveAspectRatio="none"` deja que se estire.
  const ANCHO = 1000;

  return (
    // MISMA ESTRUCTURA QUE UNA FILA DE LA TABLA: una etiqueta fija a la
    // izquierda y, a su derecha, exactamente `n` columnas de semana. Si el
    // lienzo abarcara también la etiqueta, la curva saldría desplazada el
    // ancho de esa columna y dejaría de caer bajo la semana que describe —que
    // es justo lo único que tiene que hacer bien.
    <div className="flex" style={{ height: `calc(${alto}px * var(--z))` }}>
      <div
        className="sticky left-0 z-20 flex shrink-0 flex-col justify-between bg-[#0f1115] pr-1 text-right"
        style={{
          width: "var(--ancho-etiqueta)",
          paddingTop: `calc(${MARGEN}px * var(--z))`,
          paddingBottom: `calc(${MARGEN}px * var(--z))`,
        }}
      >
        {MARCAS_EJE.map((pct) => (
          <span key={pct} className="text-[10px] leading-none tabular-nums text-white/25">
            {pct} %
          </span>
        ))}
      </div>

      <svg
        height="100%"
        viewBox={`0 0 ${ANCHO} ${alto}`}
        preserveAspectRatio="none"
        aria-label="Curva de carga por semana"
        className="block shrink-0"
        style={{ width: `calc(var(--ancho-celda) * ${semanas})` }}
      >
        {/* Retícula fija. Que sea fija —y no calculada de los datos— es lo que
            permite comparar dos macrociclos de un vistazo. */}
        {MARCAS_EJE.map((pct) => {
          const y = MARGEN + (alto - MARGEN * 2) * (1 - pct / 100);
          return (
            <line
              key={pct}
              x1={0}
              x2={ANCHO}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth={pct === 100 ? 1 : 0.5}
              className="text-white/[0.07]"
            />
          );
        })}

        {/* Una línea vertical por semana, para que se lea a qué columna
            pertenece cada cresta sin tener que seguirla con el dedo. */}
        {Array.from({ length: semanas + 1 }, (_, i) => (
          <line
            key={i}
            x1={(i * ANCHO) / semanas}
            x2={(i * ANCHO) / semanas}
            y1={0}
            y2={alto}
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-white/[0.05]"
          />
        ))}

        {series.map((s) => (
          <g key={s.filaId}>
            {/* Un `path` POR TRAMO. Los huecos quedan a la vista. */}
            {s.tramos.map((tramo, i) => (
              <path
                key={i}
                d={trazoDeTramo(tramo, semanas, ANCHO, alto, MARGEN)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                // El trazo no se deforma al estirar el viewBox; sin esto, una
                // rejilla de 104 semanas produciría líneas finísimas en
                // vertical y gruesas en horizontal.
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
              />
            ))}
            {/* ── LOS PUNTOS NO SON `<circle>`, Y NO POR CAPRICHO ──────────
                El lienzo se estira con `preserveAspectRatio="none"` para
                seguir el ancho de la rejilla, y eso deforma cualquier figura:
                en un plan de 104 semanas la escala horizontal y la vertical se
                separan tanto que un círculo sale convertido en una elipse
                aplastada.

                Un segmento de longitud CERO con el extremo redondeado y
                `non-scaling-stroke` se dibuja como un punto perfecto del
                diámetro del trazo, y el trazo no se escala. Redondo a
                cualquier zoom y con cualquier número de semanas. */}
            {s.tramos.flat().map((p) => {
              const { x, y } = coordenada(p, semanas, ANCHO, alto, MARGEN);
              const d = `M${x.toFixed(2)},${y.toFixed(2)} L${x.toFixed(2)},${y.toFixed(2)}`;
              return (
                <path
                  key={`${s.filaId}-${p.semana}`}
                  d={d}
                  stroke={s.color}
                  strokeWidth={5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                >
                  <title>{`${s.nombre} · semana ${p.semana + 1}: ${p.valor}${s.unidad === "" ? "" : ` ${s.unidad}`}`}</title>
                </path>
              );
            })}
          </g>
        ))}
      </svg>

    </div>
  );
}

/**
 * La leyenda, aparte del lienzo.
 *
 * Cada serie dice su MÁXIMO REAL, y no es un adorno: el eje está en porcentaje
 * del máximo de cada línea, así que un «100 %» sin decir 100 % de qué es un
 * número sin referente. Volumen y intensidad no comparten unidad y tampoco
 * comparten escala; la leyenda es donde eso deja de ser una trampa visual.
 */
export function LeyendaCurva({ filas }: { filas: readonly FilaPlan[] }) {
  const series = seriesDeCurva(filas);
  if (series.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-2 text-[11px]">
      {series.map((s) => (
        <span key={s.filaId} className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: s.color }} />
          <span className="text-white/60">{s.nombre}</span>
          <span className="tabular-nums text-white/30">
            100 % = {s.maximo}
            {s.unidad === "" ? "" : ` ${s.unidad}`}
          </span>
          {/* Cuántas semanas están planificadas de cuántas. Una curva de tres
              puntos sobre cincuenta semanas parece un plan si nadie lo dice. */}
          <span className="text-white/20">
            {s.conValor}/{filas[0]?.valores.length ?? 0} sem.
          </span>
        </span>
      ))}
    </div>
  );
}
