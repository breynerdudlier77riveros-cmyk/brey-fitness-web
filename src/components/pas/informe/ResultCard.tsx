import { Card, CardContent } from "@/components/brand/Card";
import { metaDe, type ResultadoHumano } from "@/lib/pas/informe-humano";

import EvidenceBlock from "./EvidenceBlock";

// ── Tarjeta de resultado (Sprint PAS-8) ────────────────────────────────────
//
// El orden de lectura ES el diseño:
//
//   nombre humano → valor → referencia → tendencia → objetivo
//
// Quien deje de leer en la segunda línea se lleva lo que vino a buscar. Quien
// siga, se lleva el contexto. Y quien quiera saber POR QUÉ, abre los detalles.
//
// LO QUE NO APARECE AQUÍ, Y ES DELIBERADO:
//
//   P-03 · TN-1 · EQ-3 · ES-1 · «Calidad: Moderada» · «177 personas»
//
// Todo eso sigue existiendo y viaja en `detalles`. Un atleta no debería tener
// que saber qué significa P-03 para entender que levantó 46 kg.
//
// Los tres ejes se separan visualmente porque son preguntas distintas: contra
// la población, contra uno mismo y contra la meta. Mezclarlos haría leer «+4 kg»
// como si fuera una posición normativa.

interface Props {
  resultado: ResultadoHumano;
}

/** Número con coma decimal. Solo presentación. */
const num = (v: number): string =>
  v.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");

const conSigno = (v: number): string => `${v >= 0 ? "+" : "−"}${num(Math.abs(v))}`;

export default function ResultCard({ resultado: r }: Props) {
  const { referencia, tendencia, objetivo } = r;
  const tramo = r.serie.tramoActual;

  const { normativo, longitudinal, objetivo: ejeObjetivo } = r.interpretacion.porEje;
  const limites = [...new Set(
    [normativo?.limite, longitudinal?.limite, ejeObjetivo?.limite].filter(
      (l): l is string => typeof l === 'string',
    ),
  )];

  return (
    <Card className="pas8-tarjeta h-full" data-prueba={r.pruebaId} data-norma={r.detalles.normaId ?? ""}>
      <CardContent className="space-y-4 p-5">
        {/* 1 · Qué se midió */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">{r.nombre}</p>
          {r.dominio ? <p className="text-[11px] text-white/30">{r.dominio}</p> : null}
        </div>

        {/* 2 · Cuánto */}
        <p className="text-4xl leading-none font-semibold tabular-nums text-white">
          {num(r.valorObservado)}
          <span className="ml-1.5 text-lg font-normal text-white/50">{r.unidad}</span>
        </p>

        {/* 3 · Qué significa. Va antes que el detalle de cada eje: es lo que
            el atleta vino a leer, y los ejes son el porqué. */}
        {r.interpretacion.texto ? (
          <p className="pas9-interpretacion text-sm leading-relaxed text-white/80">
            {r.interpretacion.texto}
          </p>
        ) : null}

        {/* 4 · Contra su población.
            Solo se dibuja cuando la NKB ha respondido. Antes se dibujaba
            siempre, y su «no existe referencia compatible» quedaba encima del
            bloque de evidencia, que decía lo mismo con más matiz: la tarjeta
            negaba tres veces antes de mencionar lo que sí había. Un único
            dueño por pregunta. */}
        {referencia.estado === "DISPONIBLE" ? (
          <div className="pas8-referencia space-y-1" data-estado={referencia.estado}>
            <p className="text-xl font-semibold tabular-nums text-white/90">
              {referencia.resumen}
            </p>
            <p className="text-[11px] text-white/40">{referencia.poblacion}</p>
            <p className="text-sm leading-relaxed text-white/60">{referencia.explicacion}</p>
          </div>
        ) : null}

        {/* 4b · Qué evidencia hay detrás, y qué falta (PAS-10E.1).
            Va pegado a la referencia porque contestan a la misma pregunta;
            cuando la NKB ya ha respondido, este bloque solo añade lo que la
            complementa en vez de repetirla. */}
        <EvidenceBlock
          evidencia={r.evidencia}
          observado={r.valorObservado}
          unidad={r.unidad}
          normativaCubierta={r.fuenteNormativa === "nkb"}
        />

        {/* 5 · Contra sí mismo. Eje aparte: no es una posición normativa. */}
        {tendencia.disponible && tendencia.cambioAbsoluto !== null ? (
          <div className="pas8-tendencia border-t border-white/[0.06] pt-3">
            <p className="text-[11px] uppercase tracking-wider text-white/35">
              Respecto a tu medición anterior
            </p>
            <p className="mt-1 text-sm text-white/80">
              <span className="tabular-nums">{num(tendencia.valorAnterior!)}</span>
              <span className="mx-2 text-white/30">→</span>
              <span className="tabular-nums font-semibold">{num(tendencia.valorActual)}</span>
              <span className="ml-2 tabular-nums text-white/60">
                {conSigno(tendencia.cambioAbsoluto)} {r.unidad}
              </span>
            </p>
            <p className="text-[11px] text-white/30">
              {tendencia.fechaAnterior} · {tendencia.fechaActual}
            </p>
          </div>
        ) : tendencia.motivo ? (
          <div className="pas8-tendencia border-t border-white/[0.06] pt-3">
            <p className="text-[11px] uppercase tracking-wider text-white/35">Evolución</p>
            <p className="mt-1 text-sm text-white/45">{tendencia.motivo}</p>
          </div>
        ) : null}

        {/* 5b · La serie entera, cuando hay más de un par (PAS-10).
            No es un gráfico: es la sucesión de valores medidos, sin ningún
            punto intermedio inventado. Solo se dibuja el TRAMO ACTUAL, porque
            unir valores de métodos distintos afirmaría una continuidad que no
            hubo — y por eso la ruptura se enuncia debajo en vez de callarse. */}
        {tramo && tramo.puntos.length > 2 ? (
          <div className="pas10-serie border-t border-white/[0.06] pt-3">
            <p className="text-[11px] uppercase tracking-wider text-white/35">
              Serie comparable · {tramo.puntos.length} mediciones
            </p>
            <p className="mt-1 text-sm tabular-nums text-white/70">
              {tramo.puntos.map((p, i) => (
                <span key={`${p.fecha}-${i}`}>
                  {i > 0 ? <span className="mx-1.5 text-white/25">→</span> : null}
                  <span className={i === tramo.puntos.length - 1 ? "font-semibold text-white/85" : ""}>
                    {num(p.valor)}
                  </span>
                </span>
              ))}
              <span className="ml-2 text-white/40">{tramo.unidad}</span>
            </p>
            <p className="text-[11px] text-white/30">
              {tramo.puntos[0].fecha} · {tramo.puntos[tramo.puntos.length - 1].fecha}
            </p>
          </div>
        ) : null}

        {r.serie.rupturas.length > 0 ? (
          <p className="pas10-ruptura mt-2 text-[11px] leading-relaxed text-white/35">
            {r.serie.rupturas.length === 1
              ? "La serie se interrumpió una vez: "
              : `La serie se interrumpió ${r.serie.rupturas.length} veces. La última: `}
            {r.serie.rupturas[r.serie.rupturas.length - 1].detalle}
          </p>
        ) : null}

        {/* 6 · Contra su objetivo. Tercer eje, tampoco normativo. */}
        {objetivo.disponible && objetivo.objetivo ? (
          <div className="pas8-objetivo border-t border-white/[0.06] pt-3">
            <p className="text-[11px] uppercase tracking-wider text-white/35">Objetivo</p>
            <p className="mt-1 text-sm text-white/80">{objetivo.objetivo.nombre}</p>
            <p className="text-sm text-white/60">
              <span className="tabular-nums">{num(r.valorObservado)}</span>
              {/* Un objetivo de mantenimiento no tiene un «hacia»: no se va a
                  ninguna parte, se sigue estando donde se está. Por eso la
                  flecha solo aparece cuando hay un recorrido. */}
              <span className="mx-2 text-white/30">
                {objetivo.objetivo.tipo === "mantener" ? "·" : "→"}
              </span>
              <span className="tabular-nums font-semibold text-white/80">
                {metaDe(objetivo.objetivo) ??
                  (objetivo.objetivo.tipo === "mantener"
                    ? "sin rango declarado"
                    : "sin valor objetivo declarado")}
              </span>
            </p>
            {objetivo.progreso !== null ? (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-orange-500/70"
                    style={{ width: `${Math.round(objetivo.progreso * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] tabular-nums text-white/40">
                  {Math.round(objetivo.progreso * 100)}% del recorrido
                  {/* La barra se detiene en el 100 %, pero haber ido más allá
                      es un dato y no debe perderse en el tope (PAS-10). */}
                  {objetivo.superado ? (
                    <span className="pas10-superado ml-2 text-white/55">· objetivo superado</span>
                  ) : null}
                </p>
              </div>
            ) : objetivo.mantenimiento !== null ? (
              /* §13 · Mantenerse no es un porcentaje: es estar dentro o fuera.
                 Dibujar una barra aquí obligaría a inventar a qué fracción
                 equivale «dentro». */
              <p className="pas10-mantenimiento mt-2 text-[11px] text-white/45">
                {objetivo.mantenimiento === "dentro"
                  ? "El resultado está dentro del rango declarado."
                  : objetivo.mantenimiento === "por_encima"
                    ? "El resultado queda por encima del rango declarado."
                    : "El resultado queda por debajo del rango declarado."}
              </p>
            ) : objetivo.motivo ? (
              <p className="mt-1 text-[11px] text-white/35">{objetivo.motivo}</p>
            ) : null}
          </div>
        ) : null}
        {/* 7 · Lo que NO puede afirmarse. Es la parte que impide que las
            frases de arriba se lean de más, así que no se oculta. */}
        {limites.length > 0 ? (
          <div className="pas9-limites border-t border-white/[0.06] pt-3">
            <ul className="space-y-1">
              {limites.map((l) => (
                <li key={l} className="text-[11px] leading-relaxed text-white/40">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
