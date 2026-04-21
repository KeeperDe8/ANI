import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="h-7 w-48 bg-panel rounded animate-pulse mb-4" />
      <GridSkeleton />
    </div>
  );
}
