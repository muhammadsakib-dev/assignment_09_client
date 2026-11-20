import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { ProfileForm } from "@/components/profile";
import { getProfile } from "@/crud/read/getProfile";
import { auth } from "@/lib/auth";
import { ProfileSkeleton } from "@/suspense/profile-skeleton";

export const metadata: Metadata = {
  title: "Profile Settings | WedPlan",
  description: "Update your WedPlan profile photo, name, and contact details.",
};

async function ProfileContent({
  fallbackUser,
}: {
  fallbackUser: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: "user" | "vendor" | "admin";
  };
}) {
  const result = await getProfile();
  const profile = result.data ?? {
    ...fallbackUser,
    phone: "",
    location: "",
    businessName: "",
    subscriptionPlan: "free" as const,
  };

  return <ProfileForm profile={profile} />;
}

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

  const normalizedRole =
    session.user.role === "admin" || session.user.role === "vendor"
      ? session.user.role
      : "user";

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: normalizedRole,
      }}
      badge="Account Settings"
      title="Profile Settings"
      description="Manage your public display name, contact information, and profile picture."
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent
          fallbackUser={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || "",
            role: normalizedRole,
          }}
        />
      </Suspense>
    </DashboardShell>
  );
}
