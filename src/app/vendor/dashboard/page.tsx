import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Crown,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BookingsList } from "@/components/bookings";
import { DashboardShell, StatCard } from "@/components/dashboard";
import { getBookings } from "@/crud/read/getBookings";
import { getProfile } from "@/crud/read/getProfile";
import { getVendorServices } from "@/crud/read/getVendorServices";
import { auth } from "@/lib/auth";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Vendor Overview | Vendor Portal | WedPlan",
  description:
    "Overview of your wedding services, incoming customer booking requests, and subscription plan.",
};

async function VendorDashboardContent() {
  const [servicesRes, bookingsRes, profileRes] = await Promise.all([
    getVendorServices(),
    getBookings(),
    getProfile(),
  ]);

  const services = servicesRes.data ?? [];
  const bookings = bookingsRes.data ?? [];
  const plan =
    profileRes.data?.subscriptionPlan === "premium" ? "Premium" : "Free";

  const totalServices = services.length;
  const activeServices = services.filter(
    (s) => s.isActive && s.status !== "rejected",
  ).length;
  const pendingRequests = bookings.filter((b) => b.status === "pending").length;
  const bookedEvents = bookings.filter((b) => b.status === "booked").length;

  return (
    <div className="space-y-8">
      {/* 5 Spec KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total Services"
          value={totalServices}
          hint="All submitted listings"
          icon={Briefcase}
        />
        <StatCard
          label="Active Services"
          value={activeServices}
          hint={plan === "Free" ? "Max 3 on Free Plan" : "Unlimited active"}
          icon={Sparkles}
        />
        <StatCard
          label="Pending Requests"
          value={pendingRequests}
          hint="Awaiting your decision"
          icon={Clock}
        />
        <StatCard
          label="Booked Events"
          value={bookedEvents}
          hint="Approved celebrations"
          icon={CheckCircle2}
        />
        <StatCard
          label="Current Plan"
          value={plan}
          hint={plan === "Free" ? "Upgrade anytime" : "Unlimited benefits"}
          icon={Crown}
        />
      </div>

      {/* Quick Actions Strip */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Manage Your Wedding Offerings
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Publish new packages, update pricing, or upgrade your subscription
            for unlimited visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/vendor/add-service"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold transition-colors"
          >
            <span>Add New Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/vendor/services"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors"
          >
            <span>My Services</span>
          </Link>
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors"
          >
            <span>Subscription</span>
          </Link>
        </div>
      </div>

      {/* Recent Incoming Booking Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">
            Recent Incoming Booking Requests
          </h2>
          <Link
            href="/vendor/bookings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Manage all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <BookingsList
          bookings={bookings.slice(0, 3)}
          viewerRole="vendor"
          errorMessage={bookingsRes.success ? undefined : bookingsRes.message}
        />
      </div>
    </div>
  );
}

export default async function VendorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/vendor/dashboard");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

  // Strictly enforce vendor role server-side
  if (session.user.role === "admin") {
    redirect("/admin");
  }
  if (session.user.role !== "vendor") {
    redirect("/dashboard");
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: "vendor",
      }}
      badge="Vendor Overview"
      title={`Welcome, ${session.user.name}`}
      description="Monitor your active wedding services, incoming couple inquiries, and subscription plan status."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <VendorDashboardContent />
      </Suspense>
    </DashboardShell>
  );
}
