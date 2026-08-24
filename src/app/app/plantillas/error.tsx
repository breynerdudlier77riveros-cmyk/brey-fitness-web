"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

export default function PlantillasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[plantillas]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar tus plantillas"
        description="Hubo un problema al traer tus plantillas de sesión. Ninguna se ha perdido: vuelve a intentarlo."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
