import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

// Esqueleto con la forma real de la lista: cabecera, y filas del alto de una
// plantilla. Un bloque genérico haría saltar la maquetación al llegar los
// datos, que es lo que un esqueleto existe para evitar.
export default function PlantillasLoading() {
  return (
    <div aria-busy="true">
      <div className="mb-8 space-y-2">
        <SkeletonBar className="h-8 w-56" />
        <SkeletonBar className="h-3 w-80" />
      </div>
      <div className="space-y-2">
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
      </div>
    </div>
  );
}
