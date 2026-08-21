import type { Representacion } from "@/lib/pas/evidencia";

// ── Escala de evidencia (Sprint PAS-10E §8, §15, §16, §27) ─────────────────
//
// UN SOLO COMPONENTE PARA LAS ONCE PRUEBAS. La forma del gráfico la decide el
// tipo de evidencia, no la prueba: dos pruebas con percentiles se dibujan
// igual, y una con media ± DT se dibuja distinto porque **es otra cosa**.
//
// SIN SEMÁFORO, Y ES UNA DECISIÓN, NO UN OLVIDO.
//
//   Pintar de rojo un extremo de la barra afirmaría que ese extremo es malo, y
//   ninguna de las fuentes registradas define categorías. El color solo marca
//   dónde está el atleta; el resto de la escala es neutro. El día que se
//   admita una fuente que sí publique categorías, sus zonas podrán colorearse
//   citándola — y solo entonces.
//
// EL EJE ES DE VALORES, NO DE PERCENTILES. Los percentiles publicados se
// reparten sobre el eje según su valor real, así que la distancia entre P50 y
// P75 es la distancia que hay de verdad entre esos dos números. Un eje
// percentil equiespaciado deformaría la distribución y sugeriría una
// uniformidad que no existe.

interface Props {
  representacion: Representacion;
  observado: number;
  unidad: string;
}

// `posicion` era un parámetro de este componente hasta PAS-13, y se usaba para
// repetir «Entre P20 y P30» debajo del eje. Esa lectura la enuncia ahora la
// tarjeta, en español y una sola vez; el gráfico dibuja lo publicado y explica
// su propio eje, que es todo lo que un gráfico debe hacer.

/** Coma decimal. Solo presentación. */
const num = (v: number): string =>
  v.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");

/** Dónde cae un valor en el eje, en tanto por ciento. Se acota a la barra. */
const pct = (v: number, min: number, max: number): number =>
  max === min ? 50 : Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100));

/** El marcador del atleta. Es lo único con color en toda la escala. */
function Marcador({ en, etiqueta }: { en: number; etiqueta: string }) {
  return (
    <div
      className="pas10e-marcador absolute top-0 -translate-x-1/2"
      style={{ left: `${en}%` }}
      data-en={en.toFixed(1)}
    >
      <div className="h-4 w-0.5 bg-orange-400" />
      <p className="mt-1 whitespace-nowrap text-[11px] font-semibold tabular-nums text-orange-300">
        {etiqueta}
      </p>
    </div>
  );
}

/** La barra base, común a todas las representaciones con eje. */
function Riel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-2 mb-10 h-4">
      <div className="absolute top-1.5 h-1 w-full rounded-full bg-white/[0.09]" />
      {children}
    </div>
  );
}

/** Una marca de referencia publicada. Sin color: no afirma nada. */
function Marca({ en, arriba, abajo }: { en: number; arriba: string; abajo?: string }) {
  return (
    <div className="absolute top-0 -translate-x-1/2" style={{ left: `${en}%` }}>
      <div className="mx-auto h-4 w-px bg-white/25" />
      <p className="mt-1 whitespace-nowrap text-center text-[10px] tabular-nums text-white/40">
        {arriba}
      </p>
      {abajo ? (
        <p className="whitespace-nowrap text-center text-[10px] tabular-nums text-white/25">
          {abajo}
        </p>
      ) : null}
    </div>
  );
}

export default function EvidenceScale({ representacion: r, observado, unidad }: Props) {
  // ── Percentiles publicados ───────────────────────────────────────────────
  if (r.clase === "percentiles") {
    const puntos = [...r.puntos].sort((a, b) => a.valor - b.valor);

    // Con un solo punto publicado no hay escala que dibujar: hay un valor de
    // referencia y un resultado a un lado o al otro. Fingir una barra completa
    // insinuaría una distribución que la fuente no publica.
    if (puntos.length < 2) {
      const unico = puntos[0];
      if (!unico) return null;
      return (
        <div className="pas10e-escala" data-clase="percentil-unico">
          <div className="flex items-baseline justify-between gap-4 border-y border-white/[0.06] py-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/35">Tu resultado</p>
              <p className="text-lg font-semibold tabular-nums text-orange-300">
                {num(observado)} <span className="text-xs font-normal text-white/40">{unidad}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/35">
                Percentil {unico.p} publicado
              </p>
              <p className="text-lg font-semibold tabular-nums text-white/70">
                {num(unico.valor)} <span className="text-xs font-normal text-white/40">{unidad}</span>
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-white/35">
            La fuente solo tiene transcrito este percentil, así que no puede dibujarse una escala
            completa.
          </p>
        </div>
      );
    }

    const min = puntos[0].valor;
    const max = puntos[puntos.length - 1].valor;

    return (
      <div className="pas10e-escala" data-clase="percentiles">
        <Riel>
          {puntos.map((q) => (
            <Marca
              key={q.p}
              en={pct(q.valor, min, max)}
              arriba={`P${q.p}`}
              abajo={num(q.valor)}
            />
          ))}
          <Marcador en={pct(observado, min, max)} etiqueta={`${num(observado)} ${unidad}`} />
        </Riel>
        {/* La leyenda del eje, no el resultado (PAS-13).
            Antes aquí se repetía «Entre P20 y P30», que es la misma frase que
            la tarjeta enuncia arriba en español y el mismo límite que aparece
            al pie: tres veces lo mismo. Lo que faltaba era decir qué significa
            una marca, que es lo que el lector no sabe. */}
        <p className="text-[11px] leading-relaxed text-white/35">
          Cada marca del eje es un percentil publicado: el porcentaje de personas de la referencia
          que quedan por debajo de ese valor.
        </p>
      </div>
    );
  }

  // ── Media y desviación típica ────────────────────────────────────────────
  if (r.clase === "media_dt") {
    const min = r.media - 2 * r.dt;
    const max = r.media + 2 * r.dt;
    const sigmas = [-2, -1, 0, 1, 2];

    return (
      <div className="pas10e-escala" data-clase="media-dt">
        <Riel>
          {sigmas.map((s) => (
            <Marca
              key={s}
              en={pct(r.media + s * r.dt, min, max)}
              arriba={s === 0 ? "media" : `${s > 0 ? "+" : "−"}${Math.abs(s)} DT`}
              abajo={num(r.media + s * r.dt)}
            />
          ))}
          <Marcador en={pct(observado, min, max)} etiqueta={`${num(observado)} ${unidad}`} />
        </Riel>
        {/* El límite va pegado al gráfico porque es donde se comete el error:
            ver una campana y leer un percentil. */}
        <p className="text-[11px] text-white/35">
          Esta referencia publica la media y su dispersión, no percentiles. La distancia a la media
          no equivale a una posición percentil.
        </p>
      </div>
    );
  }

  // ── Rango de referencia ──────────────────────────────────────────────────
  if (r.clase === "rango") {
    const holgura = (r.max - r.min) * 0.25 || 1;
    const min = r.min - holgura;
    const max = r.max + holgura;

    return (
      <div className="pas10e-escala" data-clase="rango">
        <div className="relative mt-2 mb-10 h-4">
          <div className="absolute top-1.5 h-1 w-full rounded-full bg-white/[0.06]" />
          <div
            className="absolute top-1.5 h-1 rounded-full bg-white/20"
            style={{
              left: `${pct(r.min, min, max)}%`,
              width: `${pct(r.max, min, max) - pct(r.min, min, max)}%`,
            }}
          />
          <Marca en={pct(r.min, min, max)} arriba="mín." abajo={num(r.min)} />
          <Marca en={pct(r.max, min, max)} arriba="máx." abajo={num(r.max)} />
          <Marcador en={pct(observado, min, max)} etiqueta={`${num(observado)} ${unidad}`} />
        </div>
      </div>
    );
  }

  // ── Punto de corte ───────────────────────────────────────────────────────
  if (r.clase === "punto_de_corte") {
    const holgura = Math.abs(r.valor) * 0.4 || 1;
    const min = r.valor - holgura;
    const max = r.valor + holgura;

    return (
      <div className="pas10e-escala" data-clase="punto-de-corte">
        <Riel>
          <Marca en={pct(r.valor, min, max)} arriba="corte" abajo={num(r.valor)} />
          <Marcador en={pct(observado, min, max)} etiqueta={`${num(observado)} ${unidad}`} />
        </Riel>
        <div className="grid grid-cols-2 gap-3 text-[11px] text-white/40">
          <p>Por debajo: {r.porDebajo}</p>
          <p className="text-right">Por encima: {r.porEncima}</p>
        </div>
      </div>
    );
  }

  // ── Fiabilidad ───────────────────────────────────────────────────────────
  //
  // NO lleva escala, y es deliberado: un ICC no es un eje sobre el que situar
  // a nadie. Dibujarlo como una barra con el atleta encima insinuaría que su
  // resultado ocupa una posición dentro de la fiabilidad, que no significa
  // nada. Se muestran las cifras como lo que son: propiedades de la prueba.
  if (r.clase === "fiabilidad") {
    return (
      <div className="pas10e-escala flex gap-8 border-y border-white/[0.06] py-3" data-clase="fiabilidad">
        {r.icc ? (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/35">ICC publicado</p>
            <p className="text-base font-semibold tabular-nums text-white/70">
              {num(r.icc[0])} – {num(r.icc[1])}
            </p>
          </div>
        ) : null}
        {r.cvPct !== null ? (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/35">CV publicado</p>
            <p className="text-base font-semibold tabular-nums text-white/70">{num(r.cvPct)} %</p>
          </div>
        ) : null}
        <p className="ml-auto max-w-[28ch] text-[11px] leading-snug text-white/35">
          Describen cuánto se repite la prueba, no dónde cae este resultado.
        </p>
      </div>
    );
  }

  // ── Cambio frente al error de medida ─────────────────────────────────────
  if (r.clase === "error_medicion") {
    const umbral = r.mdc;
    if (umbral === null) return null;
    const max = Math.max(Math.abs(observado), umbral) * 1.3;

    return (
      <div className="pas10e-escala" data-clase="error-medicion">
        <div className="relative mt-2 mb-10 h-4">
          <div className="absolute top-1.5 h-1 w-full rounded-full bg-white/[0.06]" />
          {/* La zona por debajo del MDC es donde un cambio no se distingue del
              error. Se marca en gris: no es «malo», es indeterminado. */}
          <div
            className="absolute top-1.5 h-1 rounded-full bg-white/15"
            style={{ width: `${pct(umbral, 0, max)}%` }}
          />
          <Marca en={pct(umbral, 0, max)} arriba="MDC" abajo={num(umbral)} />
          <Marcador
            en={pct(Math.abs(observado), 0, max)}
            etiqueta={`${num(Math.abs(observado))} ${unidad}`}
          />
        </div>
        <p className="text-[11px] text-white/35">
          Por debajo del cambio mínimo detectable, una diferencia no puede distinguirse del error
          de la propia medición.
        </p>
      </div>
    );
  }

  // ── La fuente existe y falta cargarla ────────────────────────────────────
  return (
    <div
      className="pas10e-escala rounded border border-dashed border-white/15 px-4 py-3"
      data-clase="sin-transcribir"
    >
      <p className="text-[11px] leading-relaxed text-white/40">
        Existe una referencia verificada para esta prueba, pendiente de incorporar al sistema. La
        fuente publica: {r.queSePublica}.
      </p>
    </div>
  );
}
