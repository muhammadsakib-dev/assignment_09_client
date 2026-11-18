import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminServicesManager } from "@/components/admin";
import { DashboardShell } from "@/components/dashboard";
import { auth } from "@/lib/auth";
import { getAdminServices } from "@/services/read/getAdminData";
import { ServicesSkeleton } from "@/suspense/services-skeleton";

export const metadata: Metadata = {
  title: "Manage Services | Admin | WedPlan",
  description:
    "Review pending vendor wedding services, approve or reject listings, and remove inappropriate entries.",
};

async function AdminServicesContent() {
  const res = await getAdminServices();
  return (
    <AdminServicesManager
      services={res.data ?? []}
      errorMessage={res.success ? undefined : res.message}
    />
  );
}

export default async function AdminServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/services");
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
      badge="Service Moderation"
      title="Manage Submitted Services"
      description="Approve pending services to publish them live on WedPlan, reject low-quality submissions, or delete inappropriate listings."
    >
      <Suspense fallback={<ServicesSkeleton />}>
        <AdminServicesContent />
      </Suspense>
    </DashboardShell>
  );
}
