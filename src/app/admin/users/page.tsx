import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminUsersManager } from "@/components/admin";
import { DashboardShell } from "@/components/dashboard";
import { auth } from "@/lib/auth";
import { getAdminUsers } from "@/services/read/getAdminData";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Manage Users | Admin | WedPlan",
  description:
    "Search, filter, block, or unblock registered WedPlan customers and vendors.",
};

async function AdminUsersContent({
  currentAdminId,
}: {
  currentAdminId: string;
}) {
  const res = await getAdminUsers();
  return (
    <AdminUsersManager
      users={res.data ?? []}
      currentAdminId={currentAdminId}
      errorMessage={res.success ? undefined : res.message}
    />
  );
}

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/users");
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
      badge="User Management"
      title="Manage Registered Users"
      description="Search by name or email, filter by role, and block or unblock accounts."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminUsersContent currentAdminId={session.user.id} />
      </Suspense>
    </DashboardShell>
  );
}
