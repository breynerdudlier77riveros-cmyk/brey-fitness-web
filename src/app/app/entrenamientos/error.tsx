"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

// A nivel de entrenamientos/ (no por sub-ruta) — cubre calendario/ e
// historial/ por igual sin fragmentar en dos boundaries casi idénticos.
// PageHeader/EntrenamientosNav (entrenamientos/layout.tsx) siguen montados.

export default function EntrenamientosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[entrenamientos]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar tus entrenamientos"
        description="Hubo un problema al traer tu calendario o historial. Intenta de nuevo."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
