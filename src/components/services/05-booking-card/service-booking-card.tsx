"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { toast } from "@/components/ui/toast";
import { createBooking } from "@/services/create/createBooking";

interface ServiceBookingCardProps {
  serviceId: string;
  serviceName: string;
  price: number;
  defaultLocation: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  userRole: string;
  userId: string;
  userEmail: string;
}

export function ServiceBookingCard({
  serviceId,
  serviceName,
  price,
  defaultLocation,
  vendorId,
  vendorName,
  vendorEmail,
  userRole,
  userId,
  userEmail,
}: ServiceBookingCardProps) {
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState(defaultLocation);
  const [guestCount, setGuestCount] = useState("150");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isAdmin = userRole === "admin";
  const isOwnService =
    userRole === "vendor" &&
    (userId === vendorId ||
      userEmail.trim().toLowerCase() === vendorEmail.trim().toLowerCase());
  const isBookingBlocked = isAdmin || isOwnService;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBookingBlocked || !eventDate || !eventLocation.trim()) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await createBooking({
        serviceId,
        eventDate,
        eventLocation: eventLocation.trim(),
        guestCount: Number(guestCount) || 100,
        message: message.trim(),
      });

      if (!result.success) {
        const errText =
          result.message || "Could not submit booking. Please try again.";
        setErrorMessage(errText);
        toast.add({
          title: "Booking request failed",
          description: errText,
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      toast.add({
        title: "Booking request sent",
        description: `Sent to ${vendorName} for ${eventDate}.`,
        type: "success",
      });

      setIsSubmitted(true);
      setIsLoading(false);
    } catch {
      const errText = "Unexpected error while saving booking.";
      setErrorMessage(errText);
      toast.add({
        title: "Booking error",
        description: errText,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <aside className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-lg space-y-6 lg:sticky lg:top-24">
      <div className="pb-5 border-b border-border/80 flex items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Package Starting From
          </p>
          <p className="text-3xl font-bold text-foreground mt-1">
            ${price.toLocaleString()}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold">
          Available
        </span>
      </div>

      {isAdmin ? (
        <div className="rounded-2xl border border-border bg-muted/50 p-4 flex items-start gap-3 text-sm text-muted-foreground">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              Admin Account Notice
            </p>
            <p className="text-xs leading-relaxed">
              Admins cannot submit customer booking requests.
            </p>
          </div>
        </div>
      ) : isOwnService ? (
        <div className="rounded-2xl border border-border bg-muted/50 p-4 flex items-start gap-3 text-sm text-muted-foreground">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Your Listed Service</p>
            <p className="text-xs leading-relaxed">
              Vendors cannot book their own services. Manage incoming requests
              from your Vendor Dashboard.
            </p>
          </div>
        </div>
      ) : isSubmitted ? (
        <div className="rounded-2xl border border-primary/25 bg-primary-subtle/50 p-5 text-center space-y-3">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Booking Request Recorded
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your inquiry for <strong>{serviceName}</strong> on{" "}
              <strong>{eventDate}</strong> ({eventLocation}) is saved with
              status <strong className="text-primary">Pending</strong>.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/bookings"
              className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold transition-colors"
            >
              View My Bookings
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setEventDate("");
                setMessage("");
              }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Request another date
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="booking-date"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Event Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
              <input
                id="booking-date"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="booking-location"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Event Location
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
              <input
                id="booking-location"
                type="text"
                required
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Venue address or city"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="booking-guests"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Estimated Guests
            </label>
            <div className="relative flex items-center">
              <Users className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
              <input
                id="booking-guests"
                type="number"
                min={1}
                max={5000}
                required
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="booking-message"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Additional Message
            </label>
            <textarea
              id="booking-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share timing, theme preferences, or special requests..."
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? "Sending Request..." : "Request Booking"}</span>
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-border/70 flex items-center gap-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span>No upfront fee required to send a booking inquiry.</span>
      </div>
    </aside>
  );
}
