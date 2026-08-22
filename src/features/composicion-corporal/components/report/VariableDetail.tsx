import LineChart from "./LineChart";
import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import { significadoDe } from "@/lib/bcs/significados";
import type { FilaVariable, SerieTendencia } from "@/lib/bcs/reporte";

// ── Detalle de una variable (Sprint BCS-8.0) ───────────────────────────────
//
// EL PROBLEMA QUE CIERRA:
//
//   La ficha enseñaba «Proteína corporal · 12,3 kg» y se acababa ahí. La cifra
//   sola no informa a quien no sepa ya qué es la proteína corporal, cuánta es
//   mucha, o por qué el sistema no le pone una etiqueta al lado.
//
//   Los analizadores comerciales resuelven esto abriendo un panel por
//   variable: qué es, dónde cae y cómo ha evolucionado. Esto es lo mismo, con
//   una diferencia: aquí cada frase viene de un sitio citable, y donde no hay
//   escala publicada se dice, en vez de dibujar una.
//
// ── QUÉ SE MUESTRA, Y EN QUÉ ORDEN ────────────────────────────────────────
//
//   1 · Qué es          — literal del BCS Handbook 03.
//   2 · Cómo ha ido     — tu propia serie. Es la lectura que SIEMPRE sostiene,
//                         tengas o no una referencia poblacional detrás.
//   3 · Cómo se lee     — qué informa el número y de qué depende.
//   4 · Qué no dice     — lo que impide leerlo de más.
//   5 · Por qué no hay clasificación, cuando no la hay, y qué la desbloquea.
//
// El orden importa: se abre por lo que la variable ES y se cierra por lo que
// NO puede afirmarse. Poner el límite arriba convertiría cada panel en un
// descargo de responsabilidad; esconderlo al final de un enlace lo eliminaría
// de la lectura. Va al final del panel, dentro, y visible.
//
// `<details>` nativo, sin estado de React: funciona sin JavaScript, el
// navegador gestiona la accesibilidad del disclosure, y la impresión lo
// despliega por CSS (ver globals.css). Mismo criterio que el resto del
// informe.
//
// NO CLASIFICA. Ni aquí ni en `significados.ts` existe «alto», «bajo» o
// «normal» aplicado al resultado de nadie: explicar qué mide una variable y
// situarla en una escala son cosas distintas, y la segunda necesita un rango
// publicado que 24 de las 25 no tienen.

interface Props {
  fila: FilaVariable;
  /** La serie de ESTA variable, si el dominio la construyó. */
  serie?: SerieTendencia;
}

/** Rótulo interno del panel. */
function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {titulo}
      </p>
      {children}
    </div>
  );
}

export default function VariableDetail({ fila, serie }: Props) {
  const info = significadoDe(fila.id);

  // Sin descripción y sin serie no hay panel que abrir: el desplegable
  // quedaría vacío y un control que no lleva a ninguna parte es peor que su
  // ausencia.
  const haySerie = serie !== undefined && serie.puntos.length >= 2;
  if (info === null && !haySerie && fila.bloqueoClasificacion === null) return null;

  return (
    <details className="bcs-variable group mt-1">
      <summary className="cursor-pointer list-none text-[10px] text-white/35 transition-colors hover:text-white/65">
        Qué significa
      </summary>

      <div className="mt-2 space-y-3 border-l-2 border-white/[0.08] pl-3">
        {info ? (
          <Bloque titulo="Qué es">
            <p className="text-[11px] leading-relaxed text-white/60">{info.significado}</p>
          </Bloque>
        ) : null}

        {/* Tu propia serie. Va antes que cualquier lectura poblacional porque
            es la comparación que siempre se sostiene: mismo cuerpo, mismo
            aparato, mismo protocolo. */}
        {haySerie ? (
          <Bloque titulo="Cómo ha ido">
            <LineChart puntos={serie.puntos} unidad={fila.unidad} etiqueta={fila.etiqueta} />
          </Bloque>
        ) : null}

        {info ? (
          <Bloque titulo="Cómo se lee">
            <p className="text-[11px] leading-relaxed text-white/60">{info.lectura}</p>
          </Bloque>
        ) : null}

        {/* La clasificación, cuando existe. Hoy solo el IMC la tiene, y su
            texto viene del dominio con el aviso poblacional incluido. */}
        {fila.clasificacion ? (
          <Bloque titulo="Dónde cae">
            <p className="text-[11px] leading-relaxed text-white/70">{fila.clasificacion.texto}</p>
          </Bloque>
        ) : null}

        {/* Y cuando NO existe, por qué. Un hueco sin motivo devuelve el
            informe al problema que estos sprints corrigen: el lector no puede
            distinguir «no se puede saber» de «falta un dato tuyo». */}
        {fila.bloqueoClasificacion ? (
          <Bloque titulo="Por qué no lleva una etiqueta">
            <p className="text-[11px] leading-relaxed text-white/50">
              {fila.bloqueoClasificacion}
            </p>
          </Bloque>
        ) : null}

        {info ? (
          <Bloque titulo="Qué no dice">
            <p className="text-[11px] leading-relaxed text-white/45">{info.limite}</p>
          </Bloque>
        ) : null}

        <p className="flex items-center gap-1.5 text-[10px] text-white/30">
          De dónde sale este número: <ProcedenciaBadge procedencia={fila.procedencia} />
        </p>
      </div>
    </details>
  );
}
