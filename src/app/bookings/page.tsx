import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BookingsList } from "@/components/bookings";
import { DashboardShell } from "@/components/dashboard";
import { auth } from "@/lib/auth";
import { getBookings } from "@/services/read/getBookings";
import { BookingsSkeleton } from "@/suspense/bookings-skeleton";

export const metadata: Metadata = {
  title: "My Bookings | WedPlan",
  description:
    "Track your wedding service booking requests, status updates, and vendor confirmations.",
};

async function CustomerBookingsContent() {
  const result = await getBookings();

  return (
    <BookingsList
      bookings={result.data ?? []}
      viewerRole="user"
      errorMessage={result.success ? undefined : result.message}
    />
  );
}

export default async function BookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/bookings");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

  if (session.user.role === "vendor") {
    redirect("/vendor/bookings");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: "user",
      }}
      badge="Customer Bookings"
      title="My Wedding Bookings"
      description="Review booking statuses (Pending, Booked, Cancelled, Rejected) or cancel upcoming requests anytime."
    >
      <Suspense fallback={<BookingsSkeleton />}>
        <CustomerBookingsContent />
      </Suspense>
    </DashboardShell>
  );
}
