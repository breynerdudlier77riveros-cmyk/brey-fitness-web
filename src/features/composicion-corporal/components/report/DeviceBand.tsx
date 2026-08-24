import RangeBar, { type Zona } from "@/features/composicion-corporal/components/RangeBar";
import {
  procedenciaBanda,
  redactarBanda,
  type PosicionBanda,
} from "@/lib/bcs/rangos-dispositivo";

// ── La banda del aparato (Sprint BCS-13) ───────────────────────────────────
//
// La barra que el analizador comercial pinta en cada variable, reproducida con
// dos diferencias deliberadas.
//
// 1 · SIN ETIQUETA DE MÉRITO. Ni «Normal», ni «Standard», ni «Bajo». La CKB
//     (12 §5) excluye los rangos comerciales con este motivo exacto: «un rango
//     de referencia es lo que convertiría una descripción en una
//     clasificación». La prohibición es a la palabra, no al eje.
//
// 2 · SIN COLOR DE MÉRITO. Verde-ámbar-rojo es la misma etiqueta por otra vía:
//     un tramo rojo afirma que ese tramo es malo. Los tres tramos van del
//     mismo gris y solo el marcador lleva color, que es lo que hace falta para
//     encontrarse en la barra.
//
// Lo que se gana a cambio de la palabra: los dos números están escritos, el
// eje es de valores reales, y debajo dice de dónde sale el intervalo. «Normal»
// comprimía todo eso en un adjetivo.

/** Coma decimal, como en el resto del informe. */
const n = (v: number): string => String(v).replace(".", ",");

interface Props {
  posicion: PosicionBanda;
  valor: number;
  unidad: string;
  dispositivo: string | null;
}

export default function DeviceBand({ posicion, valor, unidad, dispositivo }: Props) {
  // El eje se extiende un 25 % del ancho de la banda a cada lado, para que un
  // valor fuera de intervalo se vea fuera en vez de pegado al borde.
  const holgura = (posicion.max - posicion.min) * 0.25 || 1;
  const min = Math.min(posicion.min - holgura, valor);
  const max = Math.max(posicion.max + holgura, valor);

  const zonas: Zona[] = [
    { hasta: posicion.min, etiqueta: `< ${n(posicion.min)}`, color: "bg-white/[0.07]" },
    { hasta: posicion.max, etiqueta: `${n(posicion.min)} – ${n(posicion.max)}`, color: "bg-white/25" },
    { hasta: max, etiqueta: `> ${n(posicion.max)}`, color: "bg-white/[0.07]" },
  ];

  return (
    <div className="space-y-2" data-banda={posicion.clase}>
      <RangeBar valor={valor} min={min} max={max} zonas={zonas} unidad={unidad} />

      <p className="text-sm leading-relaxed text-white/80">
        {redactarBanda(posicion, unidad)}
      </p>

      <p className="text-[11px] leading-relaxed text-white/40">
        {procedenciaBanda(dispositivo)}
      </p>
    </div>
  );
}
