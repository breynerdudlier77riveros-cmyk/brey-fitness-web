import EvidenceScale from "@/components/pas/evidencia/EvidenceScale";
import NormativeRangeBar from "@/components/pas/report-v2/NormativeRangeBar";
import { Card, CardContent } from "@/components/brand/Card";
import { poblacionEnPalabras } from "@/lib/pas/evidencia";
import { lecturaLlanaDe, metaDe, type ResultadoHumano } from "@/lib/pas/informe-humano";

import EvidenceBlock from "./EvidenceBlock";

// ── Tarjeta de resultado (Sprints PAS-8 · PAS-13) ──────────────────────────
//
// TRES PREGUNTAS, TRES SECCIONES, UN SOLO DUEÑO CADA UNA:
//
//   ¿Cómo estoy respecto a otra gente?  → Tu posición
//   ¿Cómo estoy respecto a mí mismo?    → Tu evolución
//   ¿Cómo voy hacia lo que quiero?      → Tu objetivo
//
// ── QUÉ SE ARREGLÓ EN PAS-13, Y POR QUÉ ESTABA MAL ────────────────────────
//
// 1 · EL EJE LONGITUDINAL APARECÍA TRES VECES.
//
//     La frase corrida de `interpretacion.texto` decía «subiste 4 kg desde
//     marzo», debajo un bloque «RESPECTO A TU MEDICIÓN ANTERIOR» repetía los
//     dos números, y debajo «SERIE COMPARABLE» los repetía otra vez dentro de
//     la sucesión. Es el mismo defecto que ya se corrigió para el eje
//     normativo y que aquí seguía vivo: tres dueños para una pregunta.
//
//     Ahora `interpretacion.texto` —que es la fusión de los tres ejes— NO se
//     dibuja. Cada sección usa la frase de SU eje, que viaja aparte en
//     `porEje` precisamente para esto.
//
// 2 · LA POSICIÓN SE ENSEÑABA EN JERGA.
//
//     «entre P90 y P97» es correcto y es ilegible. La tarjeta ahora enuncia lo
//     que un percentil significa —cuánta gente queda por debajo— y deja el
//     rótulo técnico para los detalles. No se inventa ninguna categoría al
//     hacerlo: sigue sin haber «bueno», «alto» ni «excelente» en ninguna
//     parte, porque ninguna fuente registrada los publica.
//
// 3 · EL ICC Y EL CV SE LE ENSEÑABAN AL ATLETA.
//
//     Describen el instrumento, no a la persona. Se han movido enteros a los
//     detalles técnicos.
//
// LO QUE SIGUE SIN APARECER, Y ES DELIBERADO:
//
//   P-03 · TN-1 · EQ-3 · ES-1 · «Calidad: Moderada» · ICC · CV · «177 personas»
//
// Todo eso existe y viaja en `detalles`. Un atleta no debería tener que saber
// qué significa P-03 para entender que levantó 46 kg.

interface Props {
  resultado: ResultadoHumano;
}

/** Número con coma decimal. Solo presentación. */
const num = (v: number): string =>
  v.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");

/** Encabezado de sección. Las tres preguntas se rotulan igual. */
function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-wider text-white/35">{children}</p>
  );
}

export default function ResultCard({ resultado: r }: Props) {
  const { referencia, tendencia, objetivo } = r;

  // Solo el TRAMO ACTUAL, y solo si tiene más de un par: unir valores de
  // métodos distintos afirmaría una continuidad que no hubo, y con dos puntos
  // la sucesión no añade nada a la frase «respecto a tu medición del …».
  const tramo = r.serie.tramoActual;
  const serie = tramo && tramo.puntos.length > 2 ? tramo : null;

  const { normativo, longitudinal, objetivo: ejeObjetivo } = r.interpretacion.porEje;
  const limites = [...new Set(
    [normativo?.limite, longitudinal?.limite, ejeObjetivo?.limite].filter(
      (l): l is string => typeof l === 'string',
    ),
  )];

  // ── Quién responde al eje normativo ────────────────────────────────────
  //
  // La precedencia ya está resuelta aguas arriba, en `fuenteNormativa`. Aquí
  // solo se lee: donde la NKB tiene cobertura manda la NKB, y la capa de
  // evidencia cubre las diez pruebas que la NKB no alcanza. Consultar las dos
  // para la misma pregunta producía dos respuestas para el mismo dato.
  const porEvidencia = r.fuenteNormativa === "evidencia" ? r.evidencia.compatibles[0] : null;
  const llano = lecturaLlanaDe(r);

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

        {/* ── 3 · TU POSICIÓN ────────────────────────────────────────────────
            Un solo dueño. Antes se dibujaba la lectura de la NKB, después el
            bloque de evidencia decía lo suyo sobre lo mismo, y la frase
            corrida de arriba lo repetía por tercera vez. */}
        {llano !== null ? (
          <section className="pas13-posicion space-y-2 border-t border-white/[0.06] pt-3" data-fuente={r.fuenteNormativa}>
            <Rotulo>Tu posición</Rotulo>

            {/* El gráfico, con la forma que decida la fuente. La barra de la
                NKB y la escala de la capa de evidencia dibujan lo mismo por
                caminos distintos; ninguna de las dos se dibuja si no hay
                valores publicados detrás. */}
            {referencia.escala !== null ? (
              <NormativeRangeBar
                escala={referencia.escala}
                valor={r.valorObservado}
                unidad={r.unidad}
                aria={referencia.aria ?? llano.texto}
                // Qué dibuja el eje, no qué código tiene la norma: una fuente
                // que publica media y dispersión marca desviaciones, y
                // cualquier otra marca percentiles.
                tipo={referencia.clase === "distancia_media" ? "TN-2" : "TN-1"}
              />
            ) : porEvidencia ? (
              <EvidenceScale
                representacion={porEvidencia.referencia.representacion}
                observado={r.valorObservado}
                unidad={r.unidad}
              />
            ) : null}

            <p className="pas13-llano text-sm leading-relaxed text-white/85">{llano.texto}</p>
            <p className="text-sm leading-relaxed text-white/55">{llano.sentido}</p>

            {/* Contra quién se compara. Va debajo y en pequeño porque es el
                dato que da validez a la frase, no la frase. */}
            {referencia.poblacion ?? (porEvidencia && poblacionEnPalabras(porEvidencia.referencia)) ? (
              <p className="text-[11px] text-white/35">
                Comparado con:{" "}
                {referencia.poblacion ?? poblacionEnPalabras(porEvidencia!.referencia)}
              </p>
            ) : null}

            {/* Cuando la norma es de otro país, decirlo es parte de la
                afirmación (PAS-13, G-06). Un percentil presentado a secas se
                lee como si fuera de aquí. */}
            {porEvidencia?.poblacionAjena ? (
              <p className="pas13-poblacion-ajena text-[11px] leading-relaxed text-white/45">
                No existe una tabla publicada para tu país en esta prueba. Se usa la que sí
                existe, medida con el mismo protocolo, y se nombra de quién es.
              </p>
            ) : null}
          </section>
        ) : (
          /* Sin posición que enseñar, la pregunta la contesta el bloque de
             evidencia: qué hay publicado y qué falta para poder comparar. */
          <EvidenceBlock evidencia={r.evidencia} normativaCubierta={false} />
        )}

        {/* ── 4 · TU EVOLUCIÓN ───────────────────────────────────────────────
            El eje longitudinal, entero, en un solo sitio: la sucesión medida,
            el cambio respecto a la anterior y la frase que lo interpreta. */}
        {/* Una ruptura entra en la condición por derecho propio: es lo único
            que el atleta tiene para saber que su histórico se cortó, y sin
            ella la serie anterior desaparece sin dejar rastro. */}
        {longitudinal !== null || tendencia.disponible || serie || r.serie.rupturas.length > 0 ? (
          <section className="pas8-tendencia space-y-1 border-t border-white/[0.06] pt-3">
            <Rotulo>
              Tu evolución
              {serie ? ` · ${serie.puntos.length} mediciones comparables` : ""}
            </Rotulo>

            {/* La serie no es un gráfico: es la sucesión de valores medidos,
                sin ningún punto intermedio inventado. Solo el TRAMO ACTUAL,
                porque unir valores de métodos distintos afirmaría una
                continuidad que no hubo. */}
            {serie ? (
              <>
                <p className="pas10-serie mt-1 text-sm tabular-nums text-white/70">
                  {serie.puntos.map((p, i) => (
                    <span key={`${p.fecha}-${i}`}>
                      {i > 0 ? <span className="mx-1.5 text-white/25">→</span> : null}
                      <span
                        className={i === serie.puntos.length - 1 ? "font-semibold text-white/90" : ""}
                      >
                        {num(p.valor)}
                      </span>
                    </span>
                  ))}
                  <span className="ml-2 text-white/40">{serie.unidad}</span>
                </p>
                <p className="text-[11px] text-white/30">
                  {serie.puntos[0].fecha} · {serie.puntos[serie.puntos.length - 1].fecha}
                </p>
              </>
            ) : null}

            {longitudinal !== null ? (
              <p className="pas9-longitudinal text-sm leading-relaxed text-white/80">
                {longitudinal.texto}
              </p>
            ) : tendencia.motivo ? (
              <p className="text-sm text-white/45">{tendencia.motivo}</p>
            ) : null}

            {r.serie.rupturas.length > 0 ? (
              <p className="pas10-ruptura text-[11px] leading-relaxed text-white/35">
                {r.serie.rupturas.length === 1
                  ? "La serie se interrumpió una vez: "
                  : `La serie se interrumpió ${r.serie.rupturas.length} veces. La última: `}
                {r.serie.rupturas[r.serie.rupturas.length - 1].detalle}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* ── 5 · TU OBJETIVO ────────────────────────────────────────────── */}
        {objetivo.disponible && objetivo.objetivo ? (
          <section className="pas8-objetivo border-t border-white/[0.06] pt-3">
            <Rotulo>Tu objetivo</Rotulo>
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
          </section>
        ) : null}

        {/* ── 6 · Lo que NO puede afirmarse ──────────────────────────────────
            Es la parte que impide que las frases de arriba se lean de más, así
            que no se oculta ni se resume. */}
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
