import type { BookingStatus } from "@/crud/bookings.types";
import { cn } from "@/lib/utils";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const STATUS_STYLES: Record<BookingStatus, { label: string; classes: string }> =
  {
    pending: {
      label: "Pending",
      classes:
        "bg-champagne/60 text-foreground border-border dark:bg-champagne/15 dark:text-champagne dark:border-champagne/25",
    },
    booked: {
      label: "Booked",
      classes: "bg-primary text-primary-foreground border-primary",
    },
    cancelled: {
      label: "Cancelled",
      classes: "bg-muted text-muted-foreground border-border",
    },
    rejected: {
      label: "Rejected",
      classes: "bg-destructive/10 text-destructive border-destructive/25",
    },
  };

export function BookingStatusBadge({
  status,
  className,
}: BookingStatusBadgeProps) {
  const config = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold capitalize shrink-0",
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
