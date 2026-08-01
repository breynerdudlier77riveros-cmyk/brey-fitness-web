import { SkeletonBlock } from "@/components/app/Skeleton";

// entrenamientos/layout.tsx ya renderiza PageHeader + EntrenamientosNav por
// encima de {children} — este skeleton solo cubre el área de la grilla.
export default function CalendarioLoading() {
  return (
    <div aria-busy="true" className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-24" />
      ))}
    </div>
  );
}
