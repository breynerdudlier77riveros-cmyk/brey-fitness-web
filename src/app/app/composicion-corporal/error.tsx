"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

export default function ComposicionCorporalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[composicion-corporal]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar Composición Corporal"
        description="Hubo un problema al traer tus clientes o mediciones. Intenta de nuevo."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
