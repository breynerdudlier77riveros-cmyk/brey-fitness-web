import { Card, CardContent } from "@/components/brand/Card";
import type { ResumenAtleta } from "@/lib/pas/informe-humano";

// ── Cabecera del informe (Sprint PAS-10 §22) ───────────────────────────────
//
// LO QUE NO HAY AQUÍ, Y ES LA DECISIÓN DE DISEÑO:
//
//   Ninguna puntuación global. Ningún «nivel». Ninguna media de percentiles.
//
// Resumir a una persona en una cifra exigiría ponderar unas pruebas frente a
// otras, y nadie ha publicado esos pesos. El número saldría de una decisión de
// producto disfrazada de medida, que es exactamente lo que este sistema existe
// para no hacer.
//
// Lo que sí puede decirse es cuánto se midió, cuánto de eso pudo compararse y
// qué falta para poder decir más. Las cuatro cifras son comprobables contando.
//
// Y las alertas señalan datos ausentes, nunca al atleta: «no consta cómo se
// midió» es un hueco del expediente, no un defecto suyo.

interface Props {
  resumen: ResumenAtleta;
}

/** Una cifra con su etiqueta. El denominador va cuando la cifra sola engaña. */
function Cifra({ valor, de, etiqueta }: { valor: number; de?: number; etiqueta: string }) {
  return (
    <div>
      <p className="text-2xl leading-none font-semibold tabular-nums text-white">
        {valor}
        {de === undefined ? null : <span className="text-base text-white/35"> / {de}</span>}
      </p>
      <p className="mt-1 text-[11px] leading-tight text-white/40">{etiqueta}</p>
    </div>
  );
}

export default function AthleteSummary({ resumen: s }: Props) {
  return (
    <section
      data-seccion="resumen-atleta"
      aria-label="Resumen de la evaluación"
      className="pas10-resumen space-y-3"
    >
      <Card className="border-white/5 bg-white/[0.02]">
        <CardContent className="p-5">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Cifra valor={s.pruebasEvaluadas} etiqueta="Pruebas evaluadas" />
            {/* El denominador importa: «3 con referencia» sin saber sobre
                cuántos resultados no dice nada. */}
            <Cifra valor={s.conReferencia} de={s.resultados} etiqueta="Con referencia comparable" />
            <Cifra valor={s.conEvolucion} de={s.resultados} etiqueta="Con medición anterior" />
            <Cifra valor={s.objetivosActivos} etiqueta="Objetivos activos" />
          </div>

          {s.objetivosAlcanzados > 0 ? (
            <p className="mt-4 text-sm text-white/55">
              {s.objetivosAlcanzados === 1
                ? "1 objetivo marcado como cumplido."
                : `${s.objetivosAlcanzados} objetivos marcados como cumplidos.`}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Las alertas van fuera de la tarjeta de cifras: son otra clase de
          información —lo que falta, no lo que hay— y mezclarlas con los números
          las convertiría en un dato más del rendimiento. */}
      {s.alertas.length > 0 ? (
        <ul className="pas10-alertas space-y-1.5" aria-label="Datos incompletos">
          {s.alertas.map((a) => (
            <li
              key={a.codigo}
              data-alerta={a.codigo}
              className="border-l-2 border-white/15 pl-3 text-[13px] leading-relaxed text-white/50"
            >
              {a.texto}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
