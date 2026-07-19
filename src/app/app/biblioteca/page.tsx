import type { Metadata } from "next";
import PageHeader from "@/components/app/PageHeader";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { Book } from "@/components/brand/icons";

export const metadata: Metadata = { title: "Biblioteca" };

// Sin getUser(): esta página no tiene ninguna fuente de datos propia que
// verificar — proxy.ts + app/app/layout.tsx ya bastan para protegerla.
// Biblioteca funcional queda fuera de este Sprint (Motor BPS/Workout
// Player), tal como se pidió explícitamente.
export default function BibliotecaPage() {
  return (
    <div>
      <PageHeader title="Biblioteca" description="Ejercicios y técnica de todos los Sistemas." />
      <DashboardCard>
        <EmptyState icon={Book} title="Próximamente" description="La biblioteca de ejercicios llega en un próximo Sprint." />
      </DashboardCard>
    </div>
  );
}
