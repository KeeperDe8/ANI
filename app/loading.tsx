import { HeroSkeleton, RowSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div>
      <HeroSkeleton />
      <div className="pt-8">
        <RowSkeleton title="Continue Watching" />
        <RowSkeleton title="Popular of the Week" />
        <RowSkeleton title="Trending Now" />
      </div>
    </div>
  );
}
