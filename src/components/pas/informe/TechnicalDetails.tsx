import { Fragment } from "react";

import type { LecturaEvidencia } from "@/lib/pas/evidencia";
import type { DetallesTecnicos } from "@/lib/pas/informe-humano";

// ── Detalles técnicos, bajo demanda (Sprint PAS-8) ─────────────────────────
//
// La información científica NO se elimina: se reubica. Aquí vive todo lo que
// antes contaminaba la tarjeta principal, y sigue estando completo.
//
// `<details>` nativo, no un acordeón con estado: funciona sin JavaScript, el
// navegador ya gestiona la accesibilidad del disclosure, y se puede buscar con
// Ctrl+F aunque esté cerrado en navegadores modernos.
//
// Cerrado por defecto. Quien abre un informe quiere saber cómo está; quien
// quiere saber por qué, lo despliega.
//
// ── LO QUE BAJÓ AQUÍ EN PAS-13 ────────────────────────────────────────────
//
//   El ICC y el CV se enseñaban en la tarjeta, delante del atleta. Son
//   propiedades del INSTRUMENTO —cuánto se repite la prueba— y no dicen nada
//   sobre quien se midió; puestas junto al resultado, un ICC de 0,97 se lee
//   como un 0,97 de nota. Aquí siguen completas, para el profesional, que es
//   quien puede usarlas.
//
//   Y el rótulo percentílico —«entre P90 y P97»— también: la tarjeta enuncia
//   ahora lo que ese rótulo significa, y el rótulo se conserva para quien
//   necesite la forma exacta.

interface Props {
  detalles: DetallesTecnicos;
  /**
   * La lectura de evidencia de este mismo resultado.
   *
   * Opcional porque no todas las vistas la tienen a mano; cuando falta, la
   * sección de fiabilidad sencillamente no se dibuja. Nunca se sustituye por
   * un valor por defecto: no hay un ICC neutro.
   */
  evidencia?: LecturaEvidencia;
  /** El rótulo técnico de la posición: `Entre el percentil 90 y el 97`. */
  posicionTecnica?: string | null;
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string | number | null }) {
  if (valor === null || valor === "") return null;
  return (
    <>
      <dt className="text-white/35">{etiqueta}</dt>
      <dd className="text-white/60">{valor}</dd>
    </>
  );
}

/** Las cifras de fiabilidad y de error de medida, con su límite pegado. */
function Fiabilidad({ evidencia }: { evidencia: LecturaEvidencia }) {
  const filas = evidencia.complementarias.filter(
    (r) => r.representacion.clase === 'fiabilidad' || r.representacion.clase === 'error_medicion',
  );
  if (filas.length === 0) return null;

  return (
    <div className="pas13-fiabilidad">
      <p className="text-[11px] uppercase tracking-wider text-white/35">
        Fiabilidad de la prueba
      </p>
      <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
        {filas.map((r) => {
          const rep = r.representacion;
          if (rep.clase === 'fiabilidad') {
            return (
              <Fragment key={r.id}>
                {rep.icc ? (
                  <Fila etiqueta="ICC publicado" valor={`${rep.icc[0]} – ${rep.icc[1]}`} />
                ) : null}
                {rep.cvPct !== null ? (
                  <Fila etiqueta="CV publicado" valor={`${rep.cvPct} %`} />
                ) : null}
              </Fragment>
            );
          }
          if (rep.clase === 'error_medicion') {
            return (
              <Fragment key={r.id}>
                <Fila etiqueta="Error típico (SEM)" valor={rep.sem} />
                <Fila etiqueta="Cambio mínimo detectable" valor={rep.mdc} />
                <Fila
                  etiqueta="Cambio mínimo detectable (%)"
                  valor={rep.mdcPct === null ? null : `${rep.mdcPct} %`}
                />
              </Fragment>
            );
          }
          return null;
        })}
      </dl>
      <p className="mt-1 text-[11px] leading-relaxed text-white/40">
        Describen cuánto se repite la prueba al medirla dos veces, no dónde cae este resultado ni
        si un cambio es real.
      </p>
    </div>
  );
}

export default function TechnicalDetails({ detalles: d, evidencia, posicionTecnica }: Props) {
  return (
    <details className="pas8-detalles group">
      <summary className="cursor-pointer list-none text-[11px] uppercase tracking-wider text-white/35 transition-colors hover:text-white/60">
        Ver detalles técnicos
      </summary>

      <div className="mt-3 space-y-3 border-l-2 border-white/[0.08] pl-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <Fila etiqueta="Código de prueba" valor={d.pruebaId} />
          <Fila etiqueta="Posición" valor={posicionTecnica ?? null} />
          <Fila etiqueta="Norma" valor={d.normaId} />
          <Fila etiqueta="Tipo de norma" valor={d.tipoNorma} />
          <Fila etiqueta="Instrumento" valor={d.instrumento} />
          <Fila etiqueta="Población" valor={d.poblacion} />
          <Fila etiqueta="Tamaño de celda" valor={d.nCelda === null ? null : `${d.nCelda} personas`} />
          <Fila etiqueta="Calidad" valor={d.calidad} />
          <Fila etiqueta="Estado de la ficha" valor={d.estadoNorma} />
          <Fila etiqueta="Conflicto" valor={d.conflicto} />
          <Fila etiqueta="Unidad" valor={d.unidad} />
          <Fila etiqueta="Referencia" valor={d.referencia} />
        </dl>

        {evidencia ? <Fiabilidad evidencia={evidencia} /> : null}

        {d.motivo ? (
          <p className="text-[11px] leading-relaxed text-white/45">{d.motivo}</p>
        ) : null}

        {d.advertencias.length > 0 ? (
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/35">Advertencias</p>
            <ul className="mt-1 space-y-1">
              {d.advertencias.map((a) => (
                <li key={a} className="text-[11px] leading-relaxed text-white/50">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {d.descartes.length > 0 ? (
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/35">
              Otras normas evaluadas
            </p>
            <ul className="mt-1 space-y-0.5">
              {d.descartes.map((x) => (
                <li key={x.naturaleza + x.total} className="text-[11px] text-white/40">
                  {x.total} {x.naturaleza}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}
