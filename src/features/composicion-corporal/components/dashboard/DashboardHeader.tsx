import PageHeader from "@/components/app/PageHeader";
import type { DashboardAnalytics } from "@/lib/bcs/dashboard";

interface Props {
  analytics: DashboardAnalytics;
  acciones?: React.ReactNode;
}

export default function DashboardHeader({ analytics, acciones }: Props) {
  const { resumen, meta } = analytics;

  return (
    <PageHeader
      title="Analítica del consultorio"
      description={`${resumen.totalClientes} ${resumen.totalClientes === 1 ? "cliente" : "clientes"} · ${resumen.medicionesVigentes} ${resumen.medicionesVigentes === 1 ? "medición" : "mediciones"} · datos a ${meta.hoyISO}`}
      actions={acciones}
    />
  );
}
