import type { Escala } from "@/lib/pas/report-v2";

// ── Barra clínica normativa (PRS v2.0) ─────────────────────────────────────
//
// SVG, no <div>: la impresión conserva un trazo vectorial nítido y el navegador
// no reflowa las marcas al cambiar de ancho.
//
// LO QUE LA BARRA AFIRMA, Y LO QUE NO:
//
//   El eje es un **eje de valores** (kg, kgf, lbf). El punto está donde cae el
//   valor medido; las marcas, donde caen los valores publicados.
//
//   La posición del punto NO afirma un percentil. Un punto a medio camino entre
//   P25 y P50 significa «pesa lo que hay a medio camino entre esos dos kilos»,
//   no «está en el percentil 37». Esa lectura sería interpolar, y ni la NKB ni
//   el NIE lo permiten. Por eso la situación va escrita, con el texto que
//   redactó el NIE, y nunca se deduce de la geometría.
//
// Accesibilidad: `role="img"` con un `aria-label` que dice todo lo que la barra
// dice, para quien no la ve. El color nunca es el único portador: cada marca
// lleva su rótulo y el punto lleva su valor.

interface Props {
  escala: Escala;
  /** Valor medido, en su unidad original. */
  valor: number;
  unidad: string;
  /** Rótulo accesible completo. Lo compone el modelo de vista. */
  aria: string;
  /** TN-1 dibuja percentiles; TN-2, desviaciones. Solo cambia el rótulo. */
  tipo: "TN-1" | "TN-2";
}

const ANCHO = 100;
const ALTO = 34;
/** Margen lateral para que el rótulo del extremo no se recorte. */
const MARGEN = 6;

/** Lleva una posición de 0–100 al ancho útil del trazo. */
const x = (posicion: number): number => MARGEN + (posicion / 100) * (ANCHO - MARGEN * 2);

export default function NormativeRangeBar({ escala, valor, unidad, aria, tipo }: Props) {
  const cx = x(escala.posicionObservado);

  return (
    <figure className="prs2-barra m-0" data-tipo={tipo} data-fuera={escala.fueraDeRango}>
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        role="img"
        aria-label={aria}
        preserveAspectRatio="none"
        className="h-[68px] w-full"
      >
        {/* Trazo del eje */}
        <line
          x1={MARGEN}
          y1={16}
          x2={ANCHO - MARGEN}
          y2={16}
          className="prs2-eje"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={0.6}
        />

        {escala.marcas.map((m) => (
          <g key={m.etiqueta} className="prs2-marca" data-principal={m.principal}>
            <line
              x1={x(m.posicion)}
              y1={m.principal ? 10 : 12}
              x2={x(m.posicion)}
              y2={m.principal ? 22 : 20}
              stroke="currentColor"
              strokeOpacity={m.principal ? 0.65 : 0.35}
              strokeWidth={m.principal ? 0.8 : 0.5}
            />
            <text
              x={x(m.posicion)}
              y={29}
              textAnchor="middle"
              fontSize={4.2}
              fill="currentColor"
              fillOpacity={m.principal ? 0.75 : 0.5}
            >
              {m.etiqueta}
            </text>
          </g>
        ))}

        {/* El valor observado. Doble círculo para que se distinga sin color. */}
        <circle cx={cx} cy={16} r={3.1} className="prs2-punto-halo" fill="currentColor" fillOpacity={0.18} />
        <circle cx={cx} cy={16} r={1.7} className="prs2-punto" fill="currentColor" />
        <text x={cx} y={6} textAnchor="middle" fontSize={4.6} fill="currentColor" fontWeight={600}>
          {valor} {unidad}
        </text>
      </svg>

      <figcaption className="sr-only">{aria}</figcaption>

      {escala.fueraDeRango ? (
        <p className="prs2-fuera mt-1 text-[11px] text-white/50">
          El valor queda fuera del intervalo que la fuente publica. El punto se muestra en el
          extremo del trazo; su posición no representa una posición normativa.
        </p>
      ) : null}
    </figure>
  );
}
