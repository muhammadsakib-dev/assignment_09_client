import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { AddServiceForm } from "@/components/vendor";
import { auth } from "@/lib/auth";
import { getProfile } from "@/services/read/getProfile";
import { getVendorServices } from "@/services/read/getVendorServices";
import { ProfileSkeleton } from "@/suspense/profile-skeleton";

export const metadata: Metadata = {
  title: "Add Wedding Service | Vendor Portal | WedPlan",
  description:
    "Publish a new wedding service directly to MongoDB with gallery images and package highlights.",
};

async function AddServiceContent() {
  const [servicesRes, profileRes] = await Promise.all([
    getVendorServices(),
    getProfile(),
  ]);

  const activeCount = (servicesRes.data ?? []).filter(
    (s) => s.isActive && s.status !== "rejected",
  ).length;
  const subscriptionPlan =
    profileRes.data?.subscriptionPlan === "premium" ? "premium" : "free";

  return (
    <AddServiceForm
      activeCount={activeCount}
      subscriptionPlan={subscriptionPlan}
    />
  );
}

export default async function VendorAddServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/vendor/add-service");
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
      badge="New Listing"
      title="Add Wedding Service"
      description="Create a real wedding service listing stored directly in MongoDB. Admin approval publishes it to couples."
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <AddServiceContent />
      </Suspense>
    </DashboardShell>
  );
}
