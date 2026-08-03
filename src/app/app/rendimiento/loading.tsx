import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

// ── Carga del Workspace (Sprint PAS-7.0) ───────────────────────────────────
// Solo el contenido: el shell (sidebar, header) ya está montado y repetirlo
// aquí produciría un parpadeo doble.

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBar className="h-3 w-32" />
        <SkeletonBar className="h-7 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
