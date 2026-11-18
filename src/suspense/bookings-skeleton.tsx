const SKELETON_ROWS = [1, 2, 3];

export function BookingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {SKELETON_ROWS.map((row) => (
        <div
          key={row}
          className="rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col md:flex-row gap-5"
        >
          <div className="aspect-16/10 md:aspect-square md:w-36 md:h-36 shrink-0 rounded-2xl bg-muted/70" />
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-32 rounded bg-muted/60" />
                <div className="h-5 w-2/3 rounded-lg bg-muted/80" />
              </div>
              <div className="h-7 w-20 rounded-full bg-muted/70" />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="h-4 w-28 rounded bg-muted/50" />
              <div className="h-4 w-24 rounded bg-muted/50" />
              <div className="h-4 w-36 rounded bg-muted/50" />
            </div>
            <div className="pt-3 border-t border-border/70 flex items-center justify-between">
              <div className="h-6 w-20 rounded bg-muted/70" />
              <div className="h-9 w-28 rounded-full bg-muted/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookingsSkeleton;
