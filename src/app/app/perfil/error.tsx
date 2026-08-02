"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

export default function PerfilError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[perfil]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar tu perfil"
        description="Hubo un problema al traer tu información personal. Intenta de nuevo."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
