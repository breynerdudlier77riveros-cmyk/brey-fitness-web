import { SkeletonBar, SkeletonBlock } from "@/components/app/Skeleton";

export default function ConfiguracionLoading() {
  return (
    <div className="max-w-2xl" aria-busy="true">
      <div className="mb-8 space-y-2">
        <SkeletonBar className="h-6 w-40" />
        <SkeletonBar className="h-3 w-52" />
      </div>
      <div className="space-y-6">
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-28" />
      </div>
    </div>
  );
}
