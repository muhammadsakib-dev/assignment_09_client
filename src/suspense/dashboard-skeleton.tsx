export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((card) => (
          <div
            key={card}
            className="rounded-3xl border border-border bg-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-muted/60" />
              <div className="size-10 rounded-2xl bg-muted/70" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-muted/80" />
          </div>
        ))}
      </div>

      {/* Activity List Skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-40 rounded bg-muted/70" />
        {[1, 2].map((row) => (
          <div
            key={row}
            className="rounded-3xl border border-border bg-card p-6 h-36 bg-muted/30"
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardSkeleton;
