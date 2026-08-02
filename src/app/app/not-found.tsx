import type { Metadata } from "next";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { HelpCircle } from "@/components/brand/icons";

// Antes de este Sprint, un notFound() dentro de /app (p. ej. un cliente de
// BCS inexistente) caía al 404 de marketing (src/app/not-found.tsx) — sin
// Sidebar/Header, rompiendo la sensación de "aplicación, no página" que
// app/app/layout.tsx ya declara como intención. Este se renderiza dentro
// del mismo árbol de layout, así que el shell se queda montado.

export const metadata: Metadata = { title: "No encontrado" };

export default function AppNotFound() {
  return (
    <DashboardCard>
      <EmptyState
        icon={HelpCircle}
        title="No encontramos esta página"
        description="El enlace puede estar mal escrito o el recurso ya no existe."
        actionLabel="Volver al Dashboard"
        actionHref="/app"
      />
    </DashboardCard>
  );
}
