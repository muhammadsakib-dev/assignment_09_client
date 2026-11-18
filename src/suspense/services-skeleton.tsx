const SKELETON_CARDS = [1, 2, 3, 4, 5, 6];

export function ServicesSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Filter Bar Skeleton */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 h-11 rounded-2xl bg-muted/70" />
          <div className="md:col-span-3 h-11 rounded-2xl bg-muted/70" />
          <div className="md:col-span-3 h-11 rounded-2xl bg-muted/70" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((pill) => (
            <div key={pill} className="h-8 w-28 rounded-full bg-muted/60" />
          ))}
        </div>
      </div>

      {/* Results Bar Skeleton */}
      <div className="h-5 w-44 rounded-lg bg-muted/60" />

      {/* 6-Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKELETON_CARDS.map((card) => (
          <div
            key={card}
            className="overflow-hidden rounded-3xl border border-border bg-card"
          >
            <div className="aspect-4/3 w-full bg-muted/70" />
            <div className="p-5 space-y-4">
              <div className="space-y-2.5">
                <div className="h-3.5 w-32 rounded-md bg-muted/60" />
                <div className="h-5 w-5/6 rounded-lg bg-muted/80" />
                <div className="h-3.5 w-24 rounded-md bg-muted/50" />
              </div>
              <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-muted/50" />
                  <div className="h-6 w-20 rounded-lg bg-muted/80" />
                </div>
                <div className="h-9 w-28 rounded-full bg-muted/70" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesSkeleton;
