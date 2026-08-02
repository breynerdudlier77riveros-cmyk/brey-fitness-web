import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

export default function ProgresoLoading() {
  return (
    <div aria-busy="true">
      <div className="mb-8 space-y-2">
        <SkeletonBar className="h-6 w-28" />
        <SkeletonBar className="h-3 w-36" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-20" />
      </div>
      <SkeletonBlock className="h-64" />
    </div>
  );
}
