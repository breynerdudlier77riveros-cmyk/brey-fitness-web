"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

export default function ProgresoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[progreso]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar tu progreso"
        description="Hubo un problema al calcular tu tonelaje semanal. Intenta de nuevo."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
