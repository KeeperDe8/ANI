import { RowSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="py-6">
      <RowSkeleton title="Trending" />
      <RowSkeleton title="Popular" />
    </div>
  );
}
