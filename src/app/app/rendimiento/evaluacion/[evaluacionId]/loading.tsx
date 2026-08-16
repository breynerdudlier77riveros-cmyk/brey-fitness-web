import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

// ── Carga de una evaluación (Sprint I-02) ──────────────────────────────────
// Es la ruta más pesada del Workspace: deriva PAE, PIE y PPRE, y además carga
// las 356 normas de la NKB desde disco para el informe normativo. Sin esqueleto,
// la pantalla queda en blanco justo el tiempo que más se nota.
//
// El bloque alto de abajo representa el informe: es lo que más tarda y lo que
// más ocupa, y anticiparlo evita que la página dé un salto al montarlo.

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBar className="h-3 w-44" />
        <SkeletonBar className="h-7 w-72" />
      </div>

      <div className="space-y-3">
        <SkeletonBar className="h-3 w-32" />
        <SkeletonBlock className="h-24" />
      </div>

      <div className="space-y-3">
        <SkeletonBar className="h-3 w-36" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-64" />
        </div>
      </div>
    </div>
  );
}
