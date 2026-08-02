import { ClienteCardSkeleton } from "@/features/composicion-corporal/components/Skeleton";

// Next.js renderiza este archivo automáticamente mientras page.tsx (Server)
// resuelve sus datos — es el estado "Carga" del BCS Design Handbook (13):
// Skeleton con la forma exacta del contenido real, no un spinner genérico.
export default function Loading() {
  return (
    <div aria-busy="true" className="space-y-8">
      <div className="h-8 w-64 bcs-skeleton rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ClienteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
