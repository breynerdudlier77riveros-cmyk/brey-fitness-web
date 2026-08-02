import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

export default function PerfilLoading() {
  return (
    <div className="max-w-2xl" aria-busy="true">
      <div className="mb-8 space-y-2">
        <SkeletonBar className="h-6 w-32" />
        <SkeletonBar className="h-3 w-20" />
      </div>
      <div className="space-y-6">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-32" />
        <div className="grid sm:grid-cols-2 gap-4">
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-28" />
        </div>
        <SkeletonBlock className="h-40" />
      </div>
    </div>
  );
}
