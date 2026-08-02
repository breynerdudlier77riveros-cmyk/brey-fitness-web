"use client";

import { useMemo, useState } from "react";
import SectionCard from "@/features/composicion-corporal/components/SectionCard";
import DashboardHeader from "@/features/composicion-corporal/components/dashboard/DashboardHeader";
import DashboardExportPanel from "@/features/composicion-corporal/components/dashboard/DashboardExportPanel";
import DashboardFilters from "@/features/composicion-corporal/components/dashboard/DashboardFilters";
import MetricsGrid from "@/features/composicion-corporal/components/dashboard/MetricsGrid";
import ClientStatusCard from "@/features/composicion-corporal/components/dashboard/ClientStatusCard";
import MonthlyActivityChart from "@/features/composicion-corporal/components/dashboard/MonthlyActivityChart";
import MeasurementsChart from "@/features/composicion-corporal/components/dashboard/MeasurementsChart";
import ClientDistributionChart from "@/features/composicion-corporal/components/dashboard/ClientDistributionChart";
import FollowUpCard from "@/features/composicion-corporal/components/dashboard/FollowUpCard";
import AlertsPanel from "@/features/composicion-corporal/components/dashboard/AlertsPanel";
import RecentActivityCard from "@/features/composicion-corporal/components/dashboard/RecentActivityCard";
import EmptyAnalyticsState from "@/features/composicion-corporal/components/dashboard/EmptyAnalyticsState";
import { filtrarSeguimiento, type DashboardAnalytics, type FiltroDashboard } from "@/lib/bcs/dashboard";

// ── Analítica del consultorio (Sprint BCS-5.0) ─────────────────────────────
// El DTO llega ya calculado desde el Server Component. Aquí solo vive el
// estado del filtro, que es una preferencia de vista: cambiarlo NO dispara
// ninguna consulta, filtra sobre datos que ya están en memoria.

interface Props {
  analytics: DashboardAnalytics;
  conteoFiltros: Record<FiltroDashboard, number>;
}

export default function AnaliticaClient({ analytics, conteoFiltros }: Props) {
  const [filtro, setFiltro] = useState<FiltroDashboard>("todos");

  const seguimiento = useMemo(
    () => filtrarSeguimiento(analytics.seguimiento, filtro),
    [analytics.seguimiento, filtro]
  );

  if (analytics.meta.consultorioVacio) {
    return (
      <>
        <DashboardHeader analytics={analytics} />
        <EmptyAnalyticsState />
      </>
    );
  }

  return (
    <div className="dashboard-print space-y-8">
      <DashboardHeader analytics={analytics} acciones={<DashboardExportPanel />} />

      <MetricsGrid analytics={analytics} />

      <div className="grid lg:grid-cols-2 print:grid-cols-2 gap-4">
        <SectionCard titulo="Estado del consultorio">
          <ClientStatusCard consultorio={analytics.consultorio} />
        </SectionCard>

        <SectionCard titulo="Distribución de clientes">
          <div className="space-y-6">
            <ClientDistributionChart segmentos={analytics.distribuciones.porEstado} titulo="Por estado" />
            <ClientDistributionChart
              segmentos={analytics.distribuciones.porNumeroDeMediciones}
              titulo="Por número de mediciones"
              variante="stack"
            />
            <ClientDistributionChart
              segmentos={analytics.distribuciones.porEnlace}
              titulo="Por enlace público"
              variante="stack"
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard titulo="Actividad mensual">
        <div className="space-y-6">
          <MonthlyActivityChart meses={analytics.actividadMensual} />
          <MeasurementsChart serie={analytics.series.clientesNuevosPorMes} titulo="Clientes nuevos por mes" />
        </div>
      </SectionCard>

      {analytics.alertas.length > 0 && (
        <SectionCard titulo="Registros a revisar">
          <AlertsPanel alertas={analytics.alertas} />
        </SectionCard>
      )}

      <SectionCard titulo="Seguimiento">
        <div className="space-y-4">
          <DashboardFilters activo={filtro} onCambiar={setFiltro} conteo={conteoFiltros} />
          <FollowUpCard filas={seguimiento} />
        </div>
      </SectionCard>

      <SectionCard titulo="Actividad reciente">
        <RecentActivityCard eventos={analytics.actividadReciente} />
      </SectionCard>
    </div>
  );
}
