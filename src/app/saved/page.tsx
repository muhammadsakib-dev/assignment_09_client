import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { SavedServicesList } from "@/components/saved";
import { auth } from "@/lib/auth";
import { getSavedServices } from "@/services/read/getSavedServices";
import { ServicesSkeleton } from "@/suspense/services-skeleton";

export const metadata: Metadata = {
  title: "Saved Services | WedPlan",
  description:
    "View and manage your shortlisted wedding venues, photographers, florists, and caterers.",
};

async function SavedContent() {
  const result = await getSavedServices();

  return (
    <SavedServicesList
      items={result.data ?? []}
      errorMessage={result.success ? undefined : result.message}
    />
  );
}

export default async function SavedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/saved");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

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
      badge="Favorites"
      title="Saved Wedding Services"
      description="Your personal shortlist of favorite wedding vendors stored securely in your account."
    >
      <Suspense fallback={<ServicesSkeleton />}>
        <SavedContent />
      </Suspense>
    </DashboardShell>
  );
}
