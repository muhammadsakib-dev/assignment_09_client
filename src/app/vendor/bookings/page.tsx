import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BookingsList } from "@/components/bookings";
import { DashboardShell } from "@/components/dashboard";
import { getBookings } from "@/crud/read/getBookings";
import { auth } from "@/lib/auth";
import { BookingsSkeleton } from "@/suspense/bookings-skeleton";

export const metadata: Metadata = {
  title: "Booking Requests | Vendor Portal | WedPlan",
  description:
    "Review incoming customer booking requests and approve or reject bookings for your wedding services.",
};

async function VendorBookingsContent() {
  const result = await getBookings();

  return (
    <BookingsList
      bookings={result.data ?? []}
      viewerRole="vendor"
      errorMessage={result.success ? undefined : result.message}
    />
  );
}

export default async function VendorBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/vendor/bookings");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

  if (session.user.role === "admin") {
    redirect("/admin");
  }
  if (session.user.role !== "vendor") {
    redirect("/bookings");
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: "vendor",
      }}
      badge="Booking Requests"
      title="Incoming Booking Requests"
      description="Approve pending wedding inquiries to mark them as Booked, or reject unavailable dates."
    >
      <Suspense fallback={<BookingsSkeleton />}>
        <VendorBookingsContent />
      </Suspense>
    </DashboardShell>
  );
}
