"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

export default function SistemaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sistema]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar tu Sistema"
        description="Hubo un problema al traer los datos de tu Sistema asignado. Intenta de nuevo."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
