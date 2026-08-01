import { SkeletonBlock } from "@/components/app/Skeleton";

export default function HistorialLoading() {
  return (
    <div aria-busy="true">
      <SkeletonBlock className="h-96" />
    </div>
  );
}
