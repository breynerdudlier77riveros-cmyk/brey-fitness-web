import MetricCard from "./MetricCard";
import type { DashboardAnalytics } from "@/lib/bcs/dashboard";

// ── Resumen general (zona 1) ───────────────────────────────────────────────
// Seis métricas. La nota de cada tarjeta aporta contexto verificable, nunca
// una valoración de la cifra.

export default function MetricsGrid({ analytics }: { analytics: DashboardAnalytics }) {
  const { resumen, series } = analytics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-3">
      <MetricCard
        etiqueta="Clientes activos"
        valor={resumen.clientesActivos}
        nota={`${resumen.clientesArchivados} archivados`}
      />
      <MetricCard etiqueta="Archivados" valor={resumen.clientesArchivados} />
      <MetricCard
        etiqueta="Mediciones"
        valor={resumen.medicionesVigentes}
        nota={resumen.medicionesAnuladas > 0 ? `${resumen.medicionesAnuladas} anuladas aparte` : undefined}
        serie={series.sparklineMediciones}
      />
      <MetricCard
        etiqueta="Promedio por cliente"
        valor={resumen.promedioMediciones}
        nota="Mediciones vigentes"
      />
      <MetricCard etiqueta="Mediciones este mes" valor={resumen.medicionesEsteMes} />
      <MetricCard etiqueta="Clientes nuevos este mes" valor={resumen.clientesNuevosEsteMes} />
    </div>
  );
}
