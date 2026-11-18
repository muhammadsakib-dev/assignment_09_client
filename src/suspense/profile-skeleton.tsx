export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 animate-pulse">
      <div className="flex items-center gap-5 pb-6 border-b border-border/70">
        <div className="size-20 rounded-full bg-muted/70 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-40 rounded bg-muted/80" />
          <div className="h-4 w-56 rounded bg-muted/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((field) => (
          <div key={field} className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-muted/50" />
            <div className="h-11 w-full rounded-2xl bg-muted/70" />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="h-11 w-36 rounded-full bg-muted/80" />
      </div>
    </div>
  );
}

export default ProfileSkeleton;
