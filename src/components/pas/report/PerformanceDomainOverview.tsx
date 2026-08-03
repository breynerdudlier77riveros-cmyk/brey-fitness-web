import PerformanceSection from "./PerformanceSection";
import InterpretationList from "./InterpretationList";
import { ETIQUETA_ESTADO } from "@/lib/pas/report";
import type { GrupoDominio } from "@/lib/pas/report";

// ── Dominios (Sprint PAS-5.0) ──────────────────────────────────────────────
// Los seis dominios del catálogo del PAS, cada uno con sus capacidades y la
// interpretación que el PIE emitió para él. El dominio F aparece igual que los
// demás aunque sus dos capacidades estén reservadas: omitirlo daría a entender
// que el catálogo tiene cinco.
//
// La barra de proporción es decorativa y va acompañada de la cifra en texto:
// nunca es la única vía para leer el dato.

interface Props {
  dominios: readonly GrupoDominio[];
}

function Proporcion({ caracterizadas, total, nombre }: { caracterizadas: number; total: number; nombre: string }) {
  const porcentaje = total === 0 ? 0 : Math.round((caracterizadas / total) * 100);

  return (
    <div
      role="img"
      aria-label={`${nombre}: ${caracterizadas} de ${total} capacidades caracterizadas.`}
      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${porcentaje}%` }} />
    </div>
  );
}

export default function PerformanceDomainOverview({ dominios }: Props) {
  return (
    <PerformanceSection
      id="dominios"
      nota="Agrupación por naturaleza funcional. La jerarquía es de organización, no de derivación."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {dominios.map((grupo) => {
          const activas = grupo.capacidades.filter((c) => !c.reservada);
          const caracterizadas = activas.filter((c) => c.estado === "evaluada").length;

          return (
            <article
              key={grupo.dominio}
              data-dominio={grupo.dominio}
              className="prs-bloque rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <h3 className="text-sm font-bold">
                {grupo.nombre}
                <span className="ml-1.5 text-[11px] font-normal text-white/40">
                  {grupo.dominio}
                </span>
              </h3>

              <p className="mt-1 text-xs text-white/50">
                {activas.length === 0
                  ? "Sin capacidades activas en esta versión."
                  : `${caracterizadas} de ${activas.length} capacidades caracterizadas.`}
              </p>

              {activas.length > 0 ? (
                <Proporcion
                  caracterizadas={caracterizadas}
                  total={activas.length}
                  nombre={grupo.nombre}
                />
              ) : null}

              <ul className="mt-3 space-y-1">
                {grupo.capacidades.map((capacidad) => (
                  <li key={capacidad.capacidad} className="flex justify-between gap-3 text-xs">
                    <span className="text-white/70">{capacidad.nombre}</span>
                    <span className="shrink-0 text-white/40">
                      {capacidad.reservada
                        ? "Fuera de alcance"
                        : ETIQUETA_ESTADO[capacidad.estado] ?? capacidad.estado}
                    </span>
                  </li>
                ))}
              </ul>

              {grupo.interpretacion ? (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <InterpretationList interpretaciones={[grupo.interpretacion]} compacto />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </PerformanceSection>
  );
}
