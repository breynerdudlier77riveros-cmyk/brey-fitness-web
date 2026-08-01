// ── BCS-C07 · Skeleton (BCS Design Handbook 06) ────────────────────────────
// "Bloques rounded-2xl con pulso sutil, mismo tamaño/posición exactos del
// contenido real que reemplazan. Nunca un spinner genérico." El propio
// Skeleton es aria-hidden; el CONTENEDOR que carga lleva aria-busy="true"
// (responsabilidad del call site, no de este primitivo).

function Bloque({ className }: { className: string }) {
  return <div aria-hidden="true" className={`bcs-skeleton rounded-2xl ${className}`} />;
}

/** Forma de una MetricCard (BCS-C01) — grid de 1/2/3 columnas, igual que el contenido real. */
export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.07] p-4 space-y-3">
      <div className="flex justify-between">
        <Bloque className="h-3 w-20" />
        <Bloque className="h-4 w-16" />
      </div>
      <Bloque className="h-7 w-24" />
      <Bloque className="h-3 w-28" />
    </div>
  );
}

/** Grid de Metric Cards — Dashboard/Reporte cargando. */
export function GridMetricSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div aria-busy="true" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: n }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Forma de una History Card (BCS-C03) — fila fecha + variables. */
export function HistoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.07] p-4 flex items-center gap-4">
      <Bloque className="h-4 w-24 flex-shrink-0" />
      <Bloque className="h-4 w-16" />
      <Bloque className="h-4 w-16" />
      <Bloque className="h-4 w-16 hidden sm:block" />
    </div>
  );
}

/** Lista de History Cards — histórico cargando. */
export function ListaHistoricoSkeleton({ n = 4 }: { n?: number }) {
  return (
    <div aria-busy="true" className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <HistoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Forma de una ClienteCard — Dashboard cargando. */
export function ClienteCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.07] p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Bloque className="h-9 w-9 rounded-full flex-shrink-0" />
        <Bloque className="h-4 w-32" />
      </div>
      <Bloque className="h-3 w-full" />
    </div>
  );
}
