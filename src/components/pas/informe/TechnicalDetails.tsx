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

interface Props {
  detalles: DetallesTecnicos;
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

export default function TechnicalDetails({ detalles: d }: Props) {
  return (
    <details className="pas8-detalles group">
      <summary className="cursor-pointer list-none text-[11px] uppercase tracking-wider text-white/35 transition-colors hover:text-white/60">
        Ver detalles técnicos
      </summary>

      <div className="mt-3 space-y-3 border-l-2 border-white/[0.08] pl-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <Fila etiqueta="Código de prueba" valor={d.pruebaId} />
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
