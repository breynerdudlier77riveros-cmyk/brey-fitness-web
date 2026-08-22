import RangeBar, { type Zona } from "@/features/composicion-corporal/components/RangeBar";
import {
  advertenciaDe,
  poblacionDe,
  redactarPosicion,
  type PosicionNormativa,
} from "@/lib/bcs/posicion-normativa";

// ── Dónde cae el valor en su norma (Sprint BCS-10.0) ───────────────────────
//
// La escala que faltaba. Y es una escala de PERCENTILES, no de bandas de
// mérito, porque es lo que la fuente publica: Amaral 2022 da percentiles por
// sexo y banda de edad, y no define en ninguna parte dónde empieza «alto».
// Pintar cuatro zonas de colores exigiría un punto de corte que pondría yo.
//
// Lo que sí puede dibujarse es dónde caen los percentiles publicados y dónde
// cae el valor entre ellos. Es más información que una etiqueta, no menos:
// una etiqueta resume siete números en una palabra.
//
// EL EJE ES DE VALORES, NO DE PERCENTILES EQUIESPACIADOS. Las marcas van donde
// caiga su valor real, así que la distancia entre P50 y P75 en pantalla es la
// distancia que hay de verdad entre esos dos números. Un eje equiespaciado
// deformaría la distribución y sugeriría una uniformidad que no existe.
//
// La advertencia de procedencia va DEBAJO Y SIEMPRE. La tabla es de otro país
// y de otro modelo de aparato: presentarla sin decirlo la convertiría en una
// norma de aquí. Mismo criterio que G-06 en el PAS.

interface Props {
  posicion: PosicionNormativa;
  valor: number;
  unidad: string;
}

export default function NormPosition({ posicion, valor, unidad }: Props) {
  const { celda, norma } = posicion;
  if (celda === null || norma === null || posicion.posicion === null) return null;

  const frase = redactarPosicion(posicion, poblacionDe(celda));
  if (frase === null) return null;

  const puntos = [...celda.puntos].sort((a, b) => a.valor - b.valor);
  const min = puntos[0].valor;
  const max = puntos[puntos.length - 1].valor;

  // Una zona por tramo entre percentiles publicados. Todas del mismo color:
  // el color aquí separa tramos, no califica ninguno.
  const zonas: Zona[] = puntos.slice(1).map((q) => ({
    hasta: q.valor,
    etiqueta: `P${q.p}`,
    color: "bg-white/20",
  }));

  return (
    <div className="space-y-2">
      <RangeBar valor={valor} min={min} max={max} zonas={zonas} unidad={unidad} />

      <p className="text-sm leading-relaxed text-white/80">{frase}</p>

      <p className="text-[11px] leading-relaxed text-white/35">
        Percentiles publicados para {poblacionDe(celda)}:{" "}
        {puntos.map((q) => `P${q.p} ${q.valor}`).join(" · ")} {unidad}.
      </p>

      <p className="text-[11px] leading-relaxed text-white/40">{advertenciaDe(posicion)}</p>

      <p className="text-[9px] leading-relaxed text-white/25">{norma.cita}</p>
    </div>
  );
}
