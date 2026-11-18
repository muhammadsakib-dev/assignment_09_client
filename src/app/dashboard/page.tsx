import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BookingsList } from "@/components/bookings";
import { DashboardShell, StatCard } from "@/components/dashboard";
import { auth } from "@/lib/auth";
import { getBookings } from "@/services/read/getBookings";
import { getSavedServices } from "@/services/read/getSavedServices";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Customer Dashboard | WedPlan",
  description:
    "Overview of your wedding booking requests, confirmed vendors, and saved services.",
};

async function CustomerDashboardContent() {
  const [bookingsRes, savedRes] = await Promise.all([
    getBookings(),
    getSavedServices(),
  ]);

  const bookings = bookingsRes.data ?? [];
  const saved = savedRes.data ?? [];

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const bookedCount = bookings.filter((b) => b.status === "booked").length;
  const rejectedCount = bookings.filter((b) => b.status === "rejected").length;

  return (
    <div className="space-y-8">
      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={totalBookings}
          hint="All submitted requests"
          icon={Calendar}
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          hint="Awaiting vendor reply"
          icon={Clock}
        />
        <StatCard
          label="Booked"
          value={bookedCount}
          hint="Approved by vendors"
          icon={CheckCircle2}
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          hint={`${saved.length} saved services`}
          icon={XCircle}
        />
      </div>

      {/* Quick Saved Banner */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-subtle text-primary shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {saved.length} Saved Wedding{" "}
              {saved.length === 1 ? "Service" : "Services"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Compare shortlisted vendors and send booking requests anytime.
            </p>
          </div>
        </div>

        <Link
          href="/saved"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors shrink-0"
        >
          <span>View Saved</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">
            Recent Booking Requests
          </h2>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <BookingsList
          bookings={bookings.slice(0, 3)}
          viewerRole="user"
          errorMessage={bookingsRes.success ? undefined : bookingsRes.message}
        />
      </div>
    </div>
  );
}

export default async function CustomerDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

  // Strictly protect Customer Dashboard from other roles
  if (session.user.role === "vendor") {
    redirect("/vendor/dashboard");
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
      badge="Customer Overview"
      title={`Welcome back, ${session.user.name}`}
      description="Track your wedding service inquiries, vendor approvals, and shortlisted favorites in one place."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <CustomerDashboardContent />
      </Suspense>
    </DashboardShell>
  );
}
