"use client";

import { useEffect } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import ErrorState from "@/components/app/ErrorState";

// Boundary raíz del Workspace — atrapa cualquier error de /app que no tenga
// su propio error.tsx más específico. Se renderiza dentro de app/app/layout.tsx,
// así que Sidebar/Header siguen montados; solo se reemplaza el contenido.

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app]", error);
  }, [error]);

  return (
    <DashboardCard>
      <ErrorState
        title="No pudimos cargar tu Workspace"
        description="Ocurrió un error inesperado. Intenta de nuevo — si el problema persiste, vuelve más tarde."
        onRetry={reset}
      />
    </DashboardCard>
  );
}
