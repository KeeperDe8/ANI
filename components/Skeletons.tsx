export function CardSkeleton() {
  return (
    <div className="w-[160px] shrink-0">
      <div className="aspect-[2/3] rounded-md bg-panel border border-border animate-pulse" />
      <div className="mt-2 h-4 w-3/4 bg-panel rounded animate-pulse" />
      <div className="mt-1 h-3 w-1/3 bg-panel rounded animate-pulse" />
    </div>
  );
}

export function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3 px-4 max-w-7xl mx-auto">{title}</h2>
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="flex gap-4 pb-2">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );
}

export function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div>
      <div className="relative h-[360px] bg-panel animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-6 w-32 bg-panel rounded animate-pulse mb-4" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-10 bg-panel rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WatchSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="h-4 w-48 bg-panel rounded animate-pulse mb-3" />
        <div className="aspect-video w-full bg-panel rounded-md animate-pulse" />
        <div className="mt-4 h-6 w-64 bg-panel rounded animate-pulse" />
      </div>
      <aside>
        <div className="h-4 w-24 bg-panel rounded animate-pulse mb-3" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="h-10 bg-panel rounded animate-pulse" />
          ))}
        </div>
      </aside>
    </div>
  );
}
