import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

// ── Carga del expediente de un atleta (Sprint I-02) ────────────────────────
// La forma imita lo que llega: cabecera, historial de evaluaciones y el
// formulario de alta. Un esqueleto que no se parece al contenido produce un
// salto al montar, que es peor que no tener esqueleto.

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBar className="h-3 w-40" />
        <SkeletonBar className="h-7 w-56" />
      </div>

      <div className="space-y-3">
        <SkeletonBar className="h-3 w-28" />
        {[0, 1, 2].map((i) => (
          <SkeletonBlock key={i} className="h-16" />
        ))}
      </div>

      <div className="space-y-3">
        <SkeletonBar className="h-3 w-36" />
        <SkeletonBlock className="h-32" />
      </div>
    </div>
  );
}
