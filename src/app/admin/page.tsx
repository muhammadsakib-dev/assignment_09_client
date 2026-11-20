import {
  ArrowRight,
  Briefcase,
  Clock,
  CreditCard,
  Heart,
  Shield,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell, StatCard } from "@/components/dashboard";
import { getAdminOverview } from "@/crud/read/getAdminData";
import { auth } from "@/lib/auth";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Platform Overview | Admin Panel | WedPlan",
  description:
    "Platform overview of users, vendors, customers, services, pending approvals, and transactions.",
};

async function AdminOverviewContent() {
  const res = await getAdminOverview();
  const stats = res.data ?? {
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalServices: 0,
    pendingServices: 0,
    totalTransactions: 0,
  };

  return (
    <div className="space-y-8">
      {/* 6 Spec KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Registered Users"
          value={stats.totalUsers}
          hint="All platform accounts"
          icon={Users}
        />
        <StatCard
          label="Total Vendors"
          value={stats.totalVendors}
          hint="Service providers"
          icon={Briefcase}
        />
        <StatCard
          label="Total Customers"
          value={stats.totalCustomers}
          hint="Couples planning weddings"
          icon={Heart}
        />
        <StatCard
          label="Total Services"
          value={stats.totalServices}
          hint="All submitted listings"
          icon={Shield}
        />
        <StatCard
          label="Pending Services"
          value={stats.pendingServices}
          hint="Awaiting admin review"
          icon={Clock}
        />
        <StatCard
          label="Total Transactions"
          value={stats.totalTransactions}
          hint="Subscription payments"
          icon={CreditCard}
        />
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/services"
          className="rounded-3xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Review &amp; Approve Services
            </h2>
            <p className="text-xs text-muted-foreground">
              {stats.pendingServices} pending{" "}
              {stats.pendingServices === 1 ? "service" : "services"} waiting for
              approval before going live.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin/users"
          className="rounded-3xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Manage Platform Users
            </h2>
            <p className="text-xs text-muted-foreground">
              Search accounts, filter by role, and block or unblock users.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }
  if (session.user.role !== "admin") {
    redirect(
      session.user.role === "vendor" ? "/vendor/dashboard" : "/dashboard",
    );
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: "admin",
      }}
      badge="Admin Panel"
      title="Platform Overview"
      description="Monitor registered users, moderate vendor wedding services, and review platform transactions."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminOverviewContent />
      </Suspense>
    </DashboardShell>
  );
}
