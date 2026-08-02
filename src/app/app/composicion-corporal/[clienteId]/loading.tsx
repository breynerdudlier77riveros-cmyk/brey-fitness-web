import { GridMetricSkeleton, ListaHistoricoSkeleton } from "@/features/composicion-corporal/components/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" className="space-y-8">
      <div className="h-8 w-48 bcs-skeleton rounded-xl" />
      <GridMetricSkeleton />
      <ListaHistoricoSkeleton />
    </div>
  );
}
