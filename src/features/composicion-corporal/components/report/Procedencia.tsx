import type { Procedencia } from "@/lib/bcs/reporte";

// ── De dónde sale el número, en palabras (Sprint BCS-11) ───────────────────
//
// Sustituye al badge «📟 DATO CRUDO» / «🧮 DERIVADO» dentro de los paneles.
//
// El sistema de procedencia del handbook es correcto y necesario: distinguir
// lo que el aparato mide de lo que el sistema calcula cambia cuánto puedes
// fiarte de una cifra. Lo que fallaba era la forma. «DATO CRUDO» es una
// etiqueta que hay que aprender antes de poder usarla, y en la cara visible
// del informe salía veintidós veces sin explicarse ni una.
//
// Aquí se dice lo mismo con una frase. Ocupa más y se entiende sin glosario,
// que en un panel que ya explica la variable es exactamente el intercambio
// correcto.

const TEXTO: Readonly<Record<Procedencia, string>> = {
  crudo:
    'Este número lo entrega el aparato directamente. Es de los que menos capas de cálculo llevan encima.',
  derivado:
    'Este número no se mide: el sistema lo calcula a partir de otros de la misma medición, así que hereda el error de todos ellos.',
  fabricante:
    'Este número sale de un algoritmo propio del fabricante del aparato, que no es público. Dos marcas distintas pueden dar cifras distintas de la misma persona.',
  validacion:
    'Este número usa un criterio que la literatura todavía discute. Se muestra, y se muestra también esa reserva.',
  producto:
    'Este criterio lo decidió BREY para el producto: no procede de ninguna fuente científica, y se declara como tal.',
};

export default function ProcedenciaTexto({ procedencia }: { procedencia: Procedencia }) {
  return (
    <p className="text-[11px] leading-relaxed text-white/40">{TEXTO[procedencia]}</p>
  );
}
