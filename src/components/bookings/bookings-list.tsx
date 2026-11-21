import {
  AlertCircle,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BookingRecord } from "@/crud/bookings.types";
import { BookingStatusBadge } from "./01-status/booking-status-badge";
import { BookingActions } from "./02-actions/booking-actions";

interface BookingsListProps {
  bookings: BookingRecord[];
  viewerRole: "user" | "customer" | "vendor" | "admin";
  errorMessage?: string;
}

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BookingsList({
  bookings,
  viewerRole,
  errorMessage,
}: BookingsListProps) {
  if (errorMessage) {
    return (
      <div className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 flex items-start gap-3 text-sm text-destructive">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Unable to Load Bookings</p>
          <p className="text-xs opacity-90">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/70 p-12 text-center space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-foreground">
            {viewerRole === "vendor"
              ? "No Booking Requests Yet"
              : "No Bookings Yet"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {viewerRole === "vendor"
              ? "Incoming customer wedding booking requests for your approved services will appear here."
              : "Explore our verified wedding vendors and submit your first booking inquiry."}
          </p>
        </div>
        {viewerRole === "user" && (
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all"
          >
            Browse Wedding Services
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <article
          key={booking.id}
          className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5"
        >
          <Link
            href={`/services/${booking.serviceId}`}
            className="relative aspect-16/10 md:aspect-square md:w-36 md:h-36 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-muted"
          >
            {booking.serviceImage && (
              <Image
                src={booking.serviceImage}
                alt={booking.serviceName}
                fill
                sizes="(min-width: 768px) 144px, 92vw"
                className="object-cover"
              />
            )}
          </Link>

          <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {booking.serviceCategory || "Wedding Service"}
                  </p>
                  <Link
                    href={`/services/${booking.serviceId}`}
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {booking.serviceName}
                  </Link>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Event: {booking.eventDate}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{booking.eventLocation || booking.location}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{booking.guestCount} guests</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Requested {formatShortDate(booking.createdAt)}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>
                    Customer:{" "}
                    <strong className="font-medium text-foreground">
                      {booking.userName} ({booking.userEmail})
                    </strong>
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>
                    Vendor:{" "}
                    <strong className="font-medium text-foreground">
                      {booking.vendorName} ({booking.vendorEmail})
                    </strong>
                  </span>
                </span>
              </div>

              {booking.message && (
                <p className="text-xs text-muted-foreground bg-muted/40 rounded-xl px-3.5 py-2 border border-border/60">
                  {booking.message}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Estimated Package
                </p>
                <p className="text-base font-bold text-foreground">
                  ${booking.price.toLocaleString()}
                </p>
              </div>

              <BookingActions
                bookingId={booking.id}
                status={booking.status}
                viewerRole={viewerRole}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
