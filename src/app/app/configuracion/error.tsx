"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

export default function ConfiguracionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[configuracion]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar tu configuración"
        description="Hubo un problema al traer tus preferencias. Intenta de nuevo."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
