import { escalar } from "@/lib/bcs/dashboard";

// ── Sparkline (Sprint BCS-5.0) ─────────────────────────────────────────────
// SVG a mano, sin librería. Serie compacta sin ejes ni etiquetas: su función
// es mostrar la forma, no permitir leer valores.

const ANCHO = 120;
const ALTO = 28;
const PAD = 3;

interface Props {
  valores: number[];
  etiqueta: string;
}

export default function Sparkline({ valores, etiqueta }: Props) {
  const escala = escalar(valores, ALTO, PAD);
  if (!escala) return null;

  const x = (i: number) => PAD + (i / (valores.length - 1)) * (ANCHO - PAD * 2);
  const linea = escala.puntos
    .map((y, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className="w-full h-7"
      role="img"
      aria-label={`${etiqueta}: evolución de ${valores.length} periodos, máximo ${escala.maximo}`}
      preserveAspectRatio="none"
    >
      <path
        d={linea}
        fill="none"
        className="stroke-orange-400/70"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
