import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

export default function SistemaLoading() {
  return (
    <div aria-busy="true">
      <div className="mb-8 space-y-2">
        <SkeletonBar className="h-6 w-28" />
        <SkeletonBar className="h-3 w-44" />
      </div>
      <SkeletonBlock className="h-48 mb-6" />
      <div className="space-y-3">
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
        <SkeletonBlock className="h-14" />
      </div>
    </div>
  );
}
