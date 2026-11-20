import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Vendor Plans Redirect | WedPlan",
  description:
    "Vendor subscription plans are exclusively available inside the authenticated Vendor Portal.",
};

export default async function PricingRedirectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/vendor/subscription");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }
  if (session.user.role === "vendor") {
    redirect("/vendor/subscription");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  redirect("/dashboard");
}
