import PerformanceSection from "./PerformanceSection";
import InterpretationList from "./InterpretationList";
import type { Interpretacion } from "@/lib/pas/interpretation";
import type { PerformanceReportViewModel } from "@/lib/pas/report";

// ── Resumen ejecutivo (Sprint PAS-5.0) ─────────────────────────────────────
// Solo lo que el PIE marcó como estructural, en su orden. El PRS no elige qué
// destacar: hacerlo sería interpretar, y además convertiría el resumen en un
// titular sobre un perfil que casi siempre estará incompleto.
//
// Las cifras son las del PIE, no un recuento propio.

interface Props {
  vista: PerformanceReportViewModel;
  resumen: readonly Interpretacion[];
}

function Cifra({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="prs-cifra rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="text-xl font-black tabular-nums">{valor}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-white/50">{etiqueta}</p>
    </div>
  );
}

export default function PerformanceExecutiveSummary({ vista, resumen }: Props) {
  const { totales } = vista;

  return (
    <PerformanceSection id="resumen">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Cifra valor={totales.caracterizadas} etiqueta="Caracterizadas" />
        <Cifra valor={totales.parciales} etiqueta="Parcialmente caracterizadas" />
        <Cifra valor={totales.desconocidas} etiqueta="Desconocidas" />
        <Cifra valor={totales.capacidadesActivas} etiqueta="Capacidades activas" />
      </div>

      <div className="mt-5">
        <InterpretationList
          interpretaciones={resumen}
          vacio="El motor de interpretación no emitió observaciones estructurales."
        />
      </div>
    </PerformanceSection>
  );
}
