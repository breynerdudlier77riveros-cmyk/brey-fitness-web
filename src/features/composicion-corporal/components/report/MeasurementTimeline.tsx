import { CATALOGO, type VariableId } from "@/lib/bcs/reporte";
import type { Medicion } from "@/lib/bcs/tipos";
import Button from "@/components/brand/Button";
import { formatearFechaLarga, formatearValor } from "./formato";

// ── Timeline del histórico (BCS Sprint 2.0) ────────────────────────────────
// Sustituye a la HistoryCard en acordeón. Cada medición es un evento sobre
// una línea temporal, con sus variables clave visibles de entrada y el resto
// en una rejilla debajo — sin nada que desplegar.
//
// Ese cambio no es estético: en el acordeón anterior el detalle nacía
// colapsado, así que en papel el histórico se imprimía vacío. Un documento
// no tiene interacción, y este componente ya no la necesita.

const CLAVES: VariableId[] = ["peso_kg", "grasa_pct", "masa_muscular_kg", "imc"];

interface Props {
  /** Mediciones vigentes, de la más reciente a la más antigua. */
  historico: Medicion[];
  /** Solo el panel del Entrenador la pasa (BCS-ADR-05). */
  onCorregir?: (medicion: Medicion) => void;
}

function VariablesSecundarias({ medicion }: { medicion: Medicion }) {
  const secundarias = (Object.keys(CATALOGO) as VariableId[])
    .filter((id) => !CLAVES.includes(id))
    .map((id) => ({ id, valor: medicion[id], def: CATALOGO[id] }))
    .filter((v) => v.valor !== null);

  if (secundarias.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-x-4 gap-y-2 mt-4 pt-3 border-t border-white/[0.05]">
      {secundarias.map(({ id, valor, def }) => (
        <div key={id}>
          <dt className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/35 truncate">
            {def.etiqueta}
          </dt>
          <dd className="text-xs font-bold text-white/80 tabular-nums">
            {formatearValor(valor, def.unidad)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function MeasurementTimeline({ historico, onCorregir }: Props) {
  return (
    <ol className="relative space-y-4">
      {historico.map((medicion, indice) => {
        const claves = CLAVES.map((id) => ({ id, valor: medicion[id], def: CATALOGO[id] })).filter(
          (v) => v.valor !== null
        );

        return (
          <li key={medicion.id} className="relative pl-8">
            {/* Eje y nodo del evento. La línea no llega al último punto. */}
            <span
              aria-hidden="true"
              className="absolute left-[7px] top-4 bottom-[-1rem] w-px bg-white/[0.10] last:hidden"
              style={{ display: indice === historico.length - 1 ? "none" : undefined }}
            />
            <span
              aria-hidden="true"
              className={`absolute left-0 top-3 w-[15px] h-[15px] rounded-full border-2 ${
                indice === 0 ? "border-orange-400 bg-orange-400/20" : "border-white/25 bg-slate-950"
              }`}
            />

            <article className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
                <h3 className="font-bold text-white text-sm">
                  {formatearFechaLarga(medicion.fecha)}
                  {indice === 0 && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.1em] text-orange-400">
                      Más reciente
                    </span>
                  )}
                </h3>
                {onCorregir && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="print:hidden"
                    onClick={() => onCorregir(medicion)}
                  >
                    Corregir
                  </Button>
                )}
              </div>

              <dl className="flex flex-wrap gap-x-6 gap-y-2">
                {claves.map(({ id, valor, def }) => (
                  <div key={id}>
                    <dt className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/40">
                      {def.etiqueta}
                    </dt>
                    <dd className="text-sm font-black text-white tabular-nums">
                      {formatearValor(valor, def.unidad)}
                    </dd>
                  </div>
                ))}
              </dl>

              <VariablesSecundarias medicion={medicion} />

              {medicion.observaciones && (
                <p className="text-xs text-white/45 mt-3 pt-3 border-t border-white/[0.05] leading-relaxed">
                  {medicion.observaciones}
                </p>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
