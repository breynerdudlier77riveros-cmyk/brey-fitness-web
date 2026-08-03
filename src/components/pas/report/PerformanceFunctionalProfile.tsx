import PerformanceSection from "./PerformanceSection";
import PerformanceCapabilityGrid from "./PerformanceCapabilityGrid";
import type { PerformanceReportViewModel } from "@/lib/pas/report";

// ── Perfil funcional (Sprint PAS-5.0) ──────────────────────────────────────
// Las 18 capacidades activas, con su estado, cobertura de registros y nivel de
// evidencia. Las dos reservadas se muestran aparte y no se mezclan con ellas:
// «fuera de alcance» y «desconocida» significan cosas distintas, y ponerlas en
// la misma tabla las igualaría visualmente.

interface Props {
  vista: PerformanceReportViewModel;
}

export default function PerformanceFunctionalProfile({ vista }: Props) {
  const activas = vista.filas.filter((f) => !f.reservada);
  const reservadas = vista.filas.filter((f) => f.reservada);

  return (
    <PerformanceSection
      id="perfil"
      nota="Estado de cada capacidad según los registros elegibles. Un estado describe el dato disponible, no al atleta."
    >
      <PerformanceCapabilityGrid
        capacidades={activas}
        titulo={`Capacidades activas del perfil funcional (${activas.length})`}
      />

      {reservadas.length > 0 ? (
        <div className="prs-bloque mt-6">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
            Fuera de alcance en esta versión
          </h3>
          <PerformanceCapabilityGrid
            capacidades={reservadas}
            titulo={`Capacidades fuera de alcance (${reservadas.length})`}
          />
        </div>
      ) : null}
    </PerformanceSection>
  );
}
