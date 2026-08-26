// ── Volumen por semana ─────────────────────────────────────────────────────
//
// LA FORMA, ANTES QUE EL COLOR.
//
//   El trabajo del dato es comparar MAGNITUDES entre semanas: ¿el bloque sube,
//   se mantiene o descarga? Comparar magnitudes son barras. No una línea: las
//   semanas son categorías discretas, no un continuo, y una línea entre la 1 y
//   la 2 dibuja una pendiente que nadie va a entrenar.
//
// ── UN SOLO EJE, SIEMPRE ──────────────────────────────────────────────────
//
//   Series y tonelaje son dos magnitudes de escalas incomparables. Ponerlas en
//   el mismo gráfico con dos ejes verticales es el error de gráficos más común
//   que existe: las dos curvas se cruzan donde el diseñador eligió las escalas,
//   no donde pasa algo. Aquí va UNA serie —la que se elija— y la otra vive en
//   la tabla de al lado, que es exacta.
//
// ── EL COLOR NO IDENTIFICA NADA ───────────────────────────────────────────
//
//   Hay una sola serie, así que el color no distingue entre nada: no hace
//   falta leyenda y el título ya nombra qué se está viendo. Las barras llevan
//   el naranja de la marca; los ejes y el texto van en tinta, nunca en el
//   color de la serie.
//
//   Y como es una sola serie con pocas barras, cada una lleva su valor escrito
//   encima. La regla de «nunca un número en cada punto» protege de las series
//   densas; con seis barras el número directo evita tener que estimar contra
//   una rejilla que aquí ni siquiera existe.
//
// ── ES UN DOCUMENTO, NO UN PANEL ──────────────────────────────────────────
//
//   Sin tooltip ni hover: esto se imprime y se lee en papel tan a menudo como
//   en pantalla. Lo que sustituye a la interacción son los valores escritos y
//   la tabla completa justo al lado — la vista de datos que cualquier gráfico
//   accesible debe tener, aquí presente siempre y no escondida tras un botón.
//
// Componente de servidor. SVG en línea: sin librería, imprime nítido a
// cualquier tamaño y no depende de que el navegador cargue nada.

interface Props {
  /** Un valor por semana, en orden. */
  valores: readonly number[];
  /** Qué se está midiendo. El gráfico no lleva leyenda porque esto lo nombra. */
  titulo: string;
  /** Se pega al valor de cada barra: «kg», «series». */
  unidad: string;
}

const ANCHO = 100;
const ALTO = 34;
const BASE = ALTO - 7; // sitio para la etiqueta de semana bajo el eje
const TECHO = 8; // sitio para el valor sobre la barra más alta

export default function VolumeChart({ valores, titulo, unidad }: Props) {
  if (valores.length === 0) return null;

  const max = Math.max(...valores);
  // Todo a cero no se dibuja: barras de altura nula con sus números encima
  // parecen un gráfico roto, y lo que dicen ya lo dice la tabla.
  if (max <= 0) return null;

  const hueco = 2; // separación entre barras, en unidades del viewBox
  const ancho = (ANCHO - hueco * (valores.length - 1)) / valores.length;
  const radio = Math.min(1.5, ancho / 3);

  return (
    <figure className="mt-4">
      <figcaption className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {titulo}
      </figcaption>

      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        // `role="img"` con descripción: un lector de pantalla no recorre una
        // rejilla de rectángulos, así que se le da la lectura de una vez.
        role="img"
        aria-label={`${titulo}. ${valores
          .map((v, i) => `Semana ${i + 1}: ${v} ${unidad}`)
          .join(". ")}`}
        // Sin `preserveAspectRatio="none"`: estirar el lienzo estiraría también
        // las letras de los valores, y un número deformado se lee peor que uno
        // pequeño. El SVG escala en proporción y la altura sale del viewBox.
        className="w-full"
      >
        {valores.map((v, i) => {
          const x = i * (ancho + hueco);
          const alto = Math.max(0.6, ((v / max) * (BASE - TECHO)));
          const y = BASE - alto;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={ancho}
                height={alto}
                rx={radio}
                // El extremo del dato va redondeado y la base pegada al eje:
                // una barra redondeada por abajo se despega de su origen y
                // deja de poder compararse con las demás.
                className="fill-orange-500/80"
              />
              <rect x={x} y={BASE - radio} width={ancho} height={radio} className="fill-orange-500/80" />

              <text
                x={x + ancho / 2}
                y={y - 1.8}
                textAnchor="middle"
                // `currentColor`: en papel la hoja fuerza tinta oscura sobre
                // todo, y así el número la hereda en vez de salir blanco.
                fill="currentColor"
                className="text-white/60"
                style={{ fontSize: "3.6px", fontWeight: 700 }}
              >
                {v.toLocaleString("es-ES")}
              </text>

              <text
                x={x + ancho / 2}
                y={ALTO - 1.5}
                textAnchor="middle"
                fill="currentColor"
                className="text-white/30"
                style={{ fontSize: "3.2px", fontWeight: 600 }}
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Línea de base recesiva: sitúa las barras sin competir con ellas. */}
        <line
          x1="0"
          y1={BASE}
          x2={ANCHO}
          y2={BASE}
          stroke="currentColor"
          strokeWidth="0.25"
          className="text-white/15"
        />
      </svg>
    </figure>
  );
}
