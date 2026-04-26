import { GridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <div className="h-10 w-64 rounded shimmer mb-2" />
      <div className="h-4 w-32 rounded shimmer mb-8" />
      <GridSkeleton />
    </div>
  );
}
