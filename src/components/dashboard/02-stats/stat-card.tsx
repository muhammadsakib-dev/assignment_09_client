import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary-subtle text-primary shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <p className="text-2xl sm:text-3xl font-bold text-foreground">
          {value}
        </p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
    </div>
  );
}
