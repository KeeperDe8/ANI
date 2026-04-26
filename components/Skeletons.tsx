export function CardSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const w = size === "sm" ? "w-[140px]" : size === "lg" ? "w-[200px]" : "w-[170px]";
  return (
    <div className={`${w} shrink-0`}>
      <div className="aspect-[2/3] rounded-lg shimmer" />
      <div className="mt-2.5 h-4 w-3/4 rounded shimmer" />
      <div className="mt-1.5 h-3 w-1/3 rounded shimmer" />
    </div>
  );
}

export function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 overflow-hidden">
        <div className="flex gap-4 pb-2">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="aspect-hero w-full shimmer" />
    </section>
  );
}

export function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] rounded-lg shimmer" />
          <div className="mt-2.5 h-4 w-3/4 rounded shimmer" />
          <div className="mt-1.5 h-3 w-1/3 rounded shimmer" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div>
      <div className="relative h-[480px] shimmer" />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="h-6 w-32 rounded shimmer mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-lg shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WatchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div>
        <div className="h-4 w-48 rounded shimmer mb-3" />
        <div className="aspect-video w-full rounded-xl shimmer" />
        <div className="mt-4 h-7 w-64 rounded shimmer" />
      </div>
      <aside>
        <div className="h-5 w-24 rounded shimmer mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg shimmer" />
          ))}
        </div>
      </aside>
    </div>
  );
}
