import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { VendorServicesManager } from "@/components/vendor";
import { auth } from "@/lib/auth";
import { getProfile } from "@/services/read/getProfile";
import { getVendorServices } from "@/services/read/getVendorServices";
import { ServicesSkeleton } from "@/suspense/services-skeleton";

export const metadata: Metadata = {
  title: "My Services | Vendor Portal | WedPlan",
  description:
    "Create, edit, pause, or delete your wedding service listings and track admin approval status.",
};

async function VendorServicesContent() {
  const [servicesRes, profileRes] = await Promise.all([
    getVendorServices(),
    getProfile(),
  ]);

  return (
    <VendorServicesManager
      services={servicesRes.data ?? []}
      subscriptionPlan={
        profileRes.data?.subscriptionPlan === "premium" ? "premium" : "free"
      }
      errorMessage={servicesRes.success ? undefined : servicesRes.message}
    />
  );
}

export default async function VendorServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/vendor/services");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

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
      badge="Vendor Listings"
      title="My Wedding Services"
      description="Publish new wedding packages, edit pricing or images, manage availability, and monitor approval status."
    >
      <Suspense fallback={<ServicesSkeleton />}>
        <VendorServicesContent />
      </Suspense>
    </DashboardShell>
  );
}
