import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Become a Vendor | WedPlan",
  description:
    "Create a WedPlan vendor account to showcase your wedding services and manage couple booking requests.",
};

export default async function ForVendorsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    if (session.user.isBlocked) {
      redirect("/login?error=blocked");
    }
    if (session.user.role === "vendor") {
      redirect("/vendor/dashboard");
    }
    if (session.user.role === "admin") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  redirect("/sign-up?role=vendor");
}
