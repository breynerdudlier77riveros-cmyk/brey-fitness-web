import { Card, CardContent } from "@/components/brand/Card";
import { lecturaLlanaDe } from "@/lib/pas/informe-humano";
import type { ResultadoInformeAtleta } from "@/features/performance-workspace/services/informe-atleta";
import type { ResultadoInformeNormativo } from "@/features/performance-workspace/services/informe-normativo";
import type { Conflicto } from "@/lib/pas/informe";

import AthleteSummary from "./AthleteSummary";
import GoalCard from "./GoalCard";
import PerformanceProfile from "./PerformanceProfile";
import ResultCard from "./ResultCard";
import TechnicalDetails from "./TechnicalDetails";

import NormativeCard from "@/components/pas/report-v2/NormativeCard";
import SummaryMetric from "@/components/pas/report-v2/SummaryMetric";
import UnavailableNorm from "@/components/pas/report-v2/UnavailableNorm";
import IncompleteSubject from "@/components/pas/report-v2/IncompleteSubject";
import TechnicalError from "@/components/pas/report-v2/TechnicalError";

// ── El informe de una evaluación, con UN DUEÑO POR PREGUNTA (PAS-14) ───────
//
// EL PROBLEMA QUE RESUELVE.
//
//   La página apilaba TRES informes del mismo expediente: el del atleta, el
//   perfil normativo y el perfil funcional. Entre los tres había dos portadas,
//   dos resúmenes ejecutivos, tres «perfiles» y dos listas de advertencias.
//
//   Tres encabezados sobre los mismos datos no dan tres respuestas: dan una
//   respuesta troceada que el lector tiene que recomponer. Es exactamente lo
//   que el informe de composición corporal ya pagó y corrigió, y la misma
//   solución aplica: cada pregunta tiene un apartado, y solo uno.
//
// ── LAS CUATRO PREGUNTAS ──────────────────────────────────────────────────
//
//   1 · ¿QUÉ SE MIDIÓ?    el resumen y cada resultado con su lectura
//   2 · ¿DÓNDE CAIGO?     el perfil por dominios y la posición normativa
//   3 · ¿QUÉ FALTA?       lo que no puede concluirse, y por qué
//   4 · ¿HACIA DÓNDE?     los objetivos
//
//   El orden importa tanto como el agrupamiento: se abre por «qué se midió» y
//   no por metodología. Un informe que empieza por la calidad de la evidencia
//   obliga a entender el sistema antes que el propio cuerpo.
//
// ── NADA CIENTÍFICO SE BORRA ──────────────────────────────────────────────
//
//   Se reubica. Las tarjetas normativas, las capacidades sin norma, las
//   advertencias de los dos motores y el resumen ejecutivo siguen todos aquí:
//   lo que cambia es que cada cosa aparece UNA vez y bajo la pregunta que
//   contesta. El perfil funcional completo pasa al detalle plegado, que es
//   demotarlo, no eliminarlo.
//
// ── LOS ESTADOS NO SE COLAPSAN ────────────────────────────────────────────
//
//   `ERROR_TECNICO`, `SUJETO_INCOMPLETO` y `SIN_MEDICIONES` siguen siendo tres
//   cosas distintas y se pintan distinto. Un fallo técnico disfrazado de
//   «faltan datos» mandaría al profesional a rellenar un formulario que ya
//   estaba completo.
//
//   Y se comprueban EN ESE ORDEN, el técnico primero. Es la precedencia que el
//   sistema lleva protegiendo desde que existe la lectura que los distingue.
//
// COMPONE. No calcula, no interpreta y no redacta.

interface Props {
  atleta: ResultadoInformeAtleta;
  normativo: ResultadoInformeNormativo;
  /**
   * Los conflictos que el motor detectó sobre los propios registros.
   *
   * Llegan aparte porque el informe del atleta NO los conoce: `medicionesDe`
   * mapea todos los registros vigentes sin agrupar, así que cuatro 1RM del
   * mismo día producen cuatro tarjetas y ninguna dice que se contradicen.
   */
  conflictos: readonly Conflicto[];
  /** El informe funcional, ya renderizado. Va al detalle técnico. */
  funcional: React.ReactNode;
}

/**
 * Los conflictos que invalidan la lectura de un resultado.
 *
 * Los que hablan del expediente (una fecha futura, un id repetido) no entran:
 * son de higiene del registro y ya viven en el detalle técnico. Estos tres
 * significan que las cifras que hay debajo NO se pueden leer como se leen
 * normalmente, y por eso van arriba del todo.
 */
const SOBRE_LOS_DATOS: ReadonlySet<Conflicto["tipo"]> = new Set([
  "resultado_divergente",
  "duplicado_exacto",
  "repeticion_no_admitida",
]);

const TITULO_CONFLICTO: Readonly<Record<string, string>> = {
  resultado_divergente: "Resultados que se contradicen",
  duplicado_exacto: "El mismo resultado registrado dos veces",
  repeticion_no_admitida: "Repeticiones en una prueba que no las admite",
};

const EXPLICACION: Readonly<Record<string, string>> = {
  resultado_divergente:
    "Hay varios valores distintos de la misma prueba en la misma fecha. Son hechos " +
    "incompatibles: el sistema no elige entre ellos y los muestra todos tal como se " +
    "registraron. Mientras estén así, esa prueba no sostiene ninguna lectura.",
  duplicado_exacto:
    "El mismo valor aparece más de una vez el mismo día. No aporta información nueva y " +
    "cuenta como dos mediciones en los recuentos.",
  repeticion_no_admitida:
    "La ficha de esta prueba no admite varios intentos en la misma fecha.",
};

/**
 * Los valores en conflicto, legibles.
 *
 * El motor los da en su forma canónica —`continuo:100:kg | continuo:50:kg`—
 * que es correcta para comparar y mala para leer. Decir «1RM: 100, 120, 150 y
 * 50 kg» hace obvio de un vistazo cuál sobra, y ese vistazo es justo lo que le
 * ahorra al profesional abrir cuatro tarjetas para descubrirlo.
 *
 * Si el formato no encaja se devuelve la cadena tal cual: inventar un formato
 * bonito sobre algo que no se entendió sería peor que enseñar lo crudo.
 */
function valoresLegibles(crudo: string | undefined): string | null {
  if (!crudo) return null;

  const partes = crudo.split("|").map((x) => x.trim()).filter(Boolean);
  if (partes.length === 0) return null;

  const numeros: string[] = [];
  let unidad = "";

  for (const parte of partes) {
    const trozos = parte.split(":");
    if (trozos[0] !== "continuo" || trozos.length < 3) return crudo;
    numeros.push(trozos[1]);
    // Una unidad distinta entre valores es otro problema distinto: se muestra
    // lo crudo en vez de fingir que comparten escala.
    if (unidad !== "" && unidad !== trozos[2]) return crudo;
    unidad = trozos[2];
  }

  const lista =
    numeros.length === 1
      ? numeros[0]
      : `${numeros.slice(0, -1).join(", ")} y ${numeros[numeros.length - 1]}`;
  return `${lista} ${unidad}`.replace(".", ",");
}

const H2 = "mb-3 text-[11px] uppercase tracking-wider text-white/40";

export default function InformeEvaluacion({
  atleta,
  normativo,
  conflictos,
  funcional,
}: Props) {
  const humano = atleta.estado === "DISPONIBLE" ? atleta.informe : null;
  const norma = normativo.estado === "DISPONIBLE" ? normativo.informe : null;

  // Las advertencias de los dos motores se funden y se deduplican. Antes
  // vivían en dos listas con títulos casi iguales, y una advertencia que los
  // dos emitieran se leía dos veces como si fueran dos problemas.
  const advertencias = [
    ...(humano?.advertencias ?? []),
    ...(norma?.advertencias ?? []),
  ].filter((a, i, todas) => todas.indexOf(a) === i);

  // El nombre legible de cada prueba sale de los propios resultados: el
  // conflicto solo trae el id, y «P-01» no le dice nada a nadie.
  const nombresDePrueba = new Map(
    (humano?.resultados ?? []).map((r) => [r.pruebaId, r.nombre]),
  );

  const objetivosSueltos = humano?.panelObjetivos.sinDatos ?? [];
  const otrosObjetivos = [
    ...(humano?.panelObjetivos.alcanzados ?? []),
    ...(humano?.panelObjetivos.pausados ?? []),
  ];

  return (
    <article className="pas8-informe reporte-prs2-print space-y-10" aria-label="Performance Assessment">
      {/* ── Portada · UNA sola ─────────────────────────────────────────── */}
      {humano ? (
        <header data-seccion="portada" className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Performance Assessment
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            {humano.atleta.nombre}
          </h1>
          <p className="text-sm text-white/50">
            {[
              humano.atleta.edad === null ? null : `${humano.atleta.edad} años`,
              humano.atleta.sexo,
              humano.fecha,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {norma ? (
            <p className="prs2-estado-cientifico pt-2 text-sm text-white/60">
              {norma.portada.estadoCientifico}
            </p>
          ) : null}
        </header>
      ) : null}

      {/* ── 1 · Qué se midió ───────────────────────────────────────────── */}
      <section data-seccion="que-se-midio" aria-label="Qué se midió">
        {humano ? <AthleteSummary resumen={humano.resumen} /> : null}

        {/* ── El conflicto va ANTES de las cifras ────────────────────────
            Estaba solo en la rejilla de capacidades del informe funcional,
            que ahora vive plegada: cuatro 1RM contradictorios del mismo día
            se pintaban como cuatro resultados normales y nada lo decía.
            Leerlo después de las tarjetas llega tarde — para entonces ya se
            han leído como si fueran cuatro hallazgos. */}
        <ConflictosDeDatos conflictos={conflictos} nombres={nombresDePrueba} />

        <h2 className={`${H2} mt-8`}>Resultados</h2>
        {humano === null || humano.resultados.length === 0 ? (
          <p className="text-sm text-white/50">
            Esta evaluación todavía no tiene mediciones registradas.
          </p>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {humano.resultados.map((r, i) => (
              <div key={`${r.pruebaId}-${r.detalles.normaId ?? i}`} className="space-y-2">
                <ResultCard resultado={r} />
                <TechnicalDetails
                  detalles={r.detalles}
                  evidencia={r.evidencia}
                  posicionTecnica={lecturaLlanaDe(r)?.tecnico ?? null}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 2 · Dónde cae ──────────────────────────────────────────────────
          El perfil por dominios y la posición normativa contestan la misma
          pregunta desde dos ángulos —qué puede concluirse en cada eje, y dónde
          cae respecto de su población— así que van juntos y no en dos
          apartados que el lector tenga que emparejar. */}
      <section data-seccion="donde-cae" aria-label="Dónde cae">
        <h2 className={H2}>Dónde cae</h2>

        {humano ? <PerformanceProfile dominios={humano.dominios} /> : null}
        {humano && humano.dominios.length > 0 ? (
          <p className="mt-4 text-sm text-white/50">{humano.estadoGeneral}</p>
        ) : null}

        {norma ? (
          <div data-seccion-v2="perfil" className="mt-8">
            <h3 className={H2}>Posición respecto de su población</h3>
            {norma.tarjetas.length === 0 ? (
              <p className="text-sm text-white/50">
                Ninguna medición de este informe dispone de una norma comparable.
              </p>
            ) : (
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                {norma.tarjetas.map((t) => (
                  <NormativeCard
                    key={t.normaId}
                    tarjeta={t}
                    panel={norma.comparabilidad[t.registroId]}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <EstadoNormativo normativo={normativo} />
        )}
      </section>

      {/* ── 3 · Qué falta ──────────────────────────────────────────────────
          Un solo sitio para todo lo que NO puede concluirse: las capacidades
          sin norma admisible y las advertencias de los dos motores. Repartido
          en dos listas parecidas, el lector no sabía si eran dos problemas o
          el mismo contado dos veces. */}
      {norma?.sinNorma.length || advertencias.length ? (
        <section data-seccion="que-falta" aria-label="Qué falta">
          <h2 className={H2}>Qué falta</h2>

          {norma && norma.sinNorma.length > 0 ? (
            <div data-seccion-v2="sin-norma" className="mb-6">
              <h3 className="mb-3 text-[11px] uppercase tracking-wider text-white/35">
                Sin norma admisible
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {norma.sinNorma.map((t) => (
                  <UnavailableNorm key={t.id} tarjeta={t} />
                ))}
              </div>
            </div>
          ) : null}

          {advertencias.length > 0 ? (
            <ul className="space-y-1.5">
              {advertencias.map((a) => (
                <li
                  key={a}
                  className="border-l-2 border-white/20 pl-3 text-sm leading-relaxed text-white/60"
                >
                  {a}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* ── 4 · Hacia dónde ────────────────────────────────────────────── */}
      {objetivosSueltos.length > 0 || otrosObjetivos.length > 0 ? (
        <section data-seccion="objetivos" aria-label="Objetivos">
          <h2 className={H2}>Hacia dónde</h2>

          {objetivosSueltos.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {objetivosSueltos.map((o) => (
                <GoalCard key={o.id} objetivo={o} />
              ))}
            </div>
          ) : null}

          {/* Pausados y cumplidos en segundo plano: no describen esta
              evaluación, pero esconderlos haría desaparecer trabajo que sí
              ocurrió. */}
          {otrosObjetivos.length > 0 ? (
            <ul className="mt-4 space-y-1.5" data-seccion="objetivos-historicos">
              {(humano?.panelObjetivos.alcanzados ?? []).map((o) => (
                <li
                  key={o.id}
                  data-objetivo-estado="cumplido"
                  className="border-l-2 border-white/15 pl-3 text-sm text-white/55"
                >
                  {o.nombre} · marcado como cumplido
                </li>
              ))}
              {(humano?.panelObjetivos.pausados ?? []).map((o) => (
                <li
                  key={o.id}
                  data-objetivo-estado="pausado"
                  className="border-l-2 border-white/10 pl-3 text-sm text-white/40"
                >
                  {o.nombre} · en pausa
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* ── BREY AI ────────────────────────────────────────────────────── */}
      <section data-seccion="brey-ai" aria-label="Análisis BREY AI">
        <h2 className={H2}>Análisis BREY AI</h2>
        <Card className="pas8-brey-ai border-white/5 bg-white/[0.02]">
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed text-white/45">
              El análisis personalizado estará disponible cuando la capa de interpretación esté
              habilitada. Cuando llegue, explicará estos mismos resultados: no calculará ninguno.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Detalle técnico ────────────────────────────────────────────────
          Plegado, no eliminado. El resumen ejecutivo del perfil normativo y el
          informe funcional completo siguen aquí enteros: son la trazabilidad
          del documento y quien la necesita sabe buscarla. Lo que no pueden es
          abrir el informe, que es lo que hacían al ir arriba. */}
      <details data-seccion="detalle-tecnico" className="pas8-detalle group">
        <summary className="cursor-pointer list-none text-[11px] uppercase tracking-wider text-white/35 transition-colors hover:text-white/60">
          Detalle técnico y metodología
        </summary>

        <div className="mt-6 space-y-10 border-l border-white/[0.08] pl-4">
          {norma && norma.resumen.length > 0 ? (
            <section data-seccion-v2="resumen" aria-label="Resumen ejecutivo">
              <h3 className={H2}>Resumen ejecutivo</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {norma.resumen.map((t) => (
                  <SummaryMetric key={t.id} tarjeta={t} />
                ))}
              </div>
            </section>
          ) : null}

          {funcional}
        </div>
      </details>
    </article>
  );
}

/**
 * Los conflictos sobre los datos, arriba y sin rodeos.
 *
 * NO los resuelve: el motor tampoco (PAS-ADR-04, «ninguna de las tres se
 * resuelve aquí, se reportan»). Lo que hace es decir que están, cuáles son y
 * qué significan para las cifras de abajo — que es justo lo que faltaba.
 */
function ConflictosDeDatos({
  conflictos,
  nombres,
}: {
  conflictos: readonly Conflicto[];
  nombres: ReadonlyMap<string, string>;
}) {
  const relevantes = conflictos.filter((c) => SOBRE_LOS_DATOS.has(c.tipo));
  if (relevantes.length === 0) return null;

  // Por tipo: tres divergencias son el mismo problema tres veces, y una lista
  // de tres avisos idénticos se lee como ruido en vez de como un problema.
  const porTipo = new Map<string, { prueba: string; valores: string | null; fecha?: string }[]>();
  for (const c of relevantes) {
    const filas = c.pruebas.map((p) => ({
      prueba: nombres.get(p) ?? p,
      valores: valoresLegibles(c.detalle.valores),
      fecha: c.detalle.fecha,
    }));
    porTipo.set(c.tipo, [...(porTipo.get(c.tipo) ?? []), ...filas]);
  }

  return (
    <div
      data-seccion="conflictos-datos"
      role="status"
      className="my-6 space-y-4 rounded-xl border border-yellow-500/25 bg-yellow-500/[0.04] p-4"
    >
      {[...porTipo].map(([tipo, filas]) => (
        <div key={tipo}>
          <p className="text-sm font-semibold text-yellow-200/90">
            {TITULO_CONFLICTO[tipo] ?? tipo}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-white/60">
            {EXPLICACION[tipo] ?? ""}
          </p>
          <ul className="mt-2 space-y-1">
            {filas.map((f, i) => (
              <li key={`${f.prueba}-${i}`} className="text-[13px] text-white/75">
                <span className="font-semibold">{f.prueba}</span>
                {f.valores ? <>: {f.valores}</> : null}
                {f.fecha ? <span className="text-white/40"> · {f.fecha}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Por qué no hay perfil normativo.
 *
 * Los tres motivos se pintan distinto a propósito: un fallo técnico disfrazado
 * de «faltan datos del atleta» manda al profesional a rellenar un formulario
 * que ya estaba completo, y uno de sujeto incompleto disfrazado de error
 * técnico le hace esperar a que se arregle algo que depende de él.
 */
function EstadoNormativo({ normativo }: { normativo: ResultadoInformeNormativo }) {
  if (normativo.estado === "ERROR_TECNICO") {
    return (
      <div className="mt-8">
        <TechnicalError origen={normativo.origen} detalle={normativo.detalle} />
      </div>
    );
  }
  if (normativo.estado === "SUJETO_INCOMPLETO") {
    return (
      <div className="mt-8">
        <IncompleteSubject ausentes={normativo.ausentes} detalle={normativo.detalle} />
      </div>
    );
  }
  if (normativo.estado === "SIN_MEDICIONES") {
    return <p className="mt-8 text-sm text-white/50">{normativo.detalle}</p>;
  }
  // `DISPONIBLE` no llega aquí: el llamador lo pinta arriba. Se devuelve null
  // en vez de un texto genérico para que, si algún día llegara, el hueco se
  // note en vez de disfrazarse de estado.
  return null;
}
