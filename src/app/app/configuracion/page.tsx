import type { Metadata } from "next";
import PageHeader from "@/components/app/PageHeader";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { Settings } from "@/components/brand/icons";

export const metadata: Metadata = { title: "Configuración" };

// Sin getUser(): igual que Biblioteca, sin fuente de datos propia todavía.
export default function ConfiguracionPage() {
  return (
    <div>
      <PageHeader title="Configuración" description="Preferencias de tu cuenta." />
      <DashboardCard>
        <EmptyState icon={Settings} title="Próximamente" description="Las preferencias de cuenta llegan en un próximo Sprint." />
      </DashboardCard>
    </div>
  );
}
