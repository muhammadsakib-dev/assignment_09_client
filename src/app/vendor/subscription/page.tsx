import { ArrowRight, Check, Crown, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { auth } from "@/lib/auth";
import { getProfile } from "@/services/read/getProfile";
import { getVendorServices } from "@/services/read/getVendorServices";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Vendor Subscription | WedPlan",
  description:
    "Compare Free and Premium vendor subscription tiers and upgrade for unlimited wedding service listings.",
};

const FREE_FEATURES = [
  "Maximum 3 active wedding services",
  "Basic Vendor Dashboard & analytics",
  "Booking request management (Approve / Reject)",
  "Public vendor profile & portfolio",
];

const PREMIUM_FEATURES = [
  "Unlimited active wedding services",
  "Exclusive Premium Vendor Badge across listings",
  "Priority search & category placement",
  "All Free Plan features included",
];

async function SubscriptionContent() {
  const [profileRes, servicesRes] = await Promise.all([
    getProfile(),
    getVendorServices(),
  ]);

  const isPremium = profileRes.data?.subscriptionPlan === "premium";
  const activeServices = (servicesRes.data ?? []).filter(
    (s) => s.isActive && s.status !== "rejected",
  ).length;

  return (
    <div className="space-y-8">
      {/* Active Plan Banner */}
      <div className="rounded-3xl border border-primary/25 bg-primary-subtle/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Active Subscription
          </p>
          <h2 className="text-xl font-bold text-foreground">
            {isPremium ? "Premium Vendor Plan" : "Free Vendor Plan"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isPremium
              ? "You have unlimited active service listings and the Premium Vendor Badge enabled."
              : `You are currently using ${activeServices} of 3 active service slots on the Free Plan.`}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border text-xs font-bold text-foreground shrink-0">
          <Crown className="w-4 h-4 text-primary" />
          <span>{isPremium ? "Premium Active" : "Free Tier"}</span>
        </span>
      </div>

      {/* Side-by-Side Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="rounded-3xl border border-border bg-card p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Free Plan</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Everything needed to start showcasing your services.
              </p>
            </div>
            <p className="text-4xl font-bold text-foreground">
              $0{" "}
              <span className="text-sm font-medium text-muted-foreground">
                / forever
              </span>
            </p>
            <ul className="space-y-3 pt-2 border-t border-border/70">
              {FREE_FEATURES.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2.5 text-sm text-foreground/90"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="py-3 rounded-full border border-border bg-muted/50 text-center text-xs font-semibold text-muted-foreground">
            {isPremium ? "Included in Premium" : "Current Active Plan"}
          </div>
        </div>

        {/* Premium Plan */}
        <div className="rounded-3xl border border-primary/50 bg-card p-7 shadow-lg ring-1 ring-primary/15 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Premium Plan
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Scale your wedding business with unlimited listings.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0">
                <Crown className="w-3.5 h-3.5" />
                <span>Recommended</span>
              </span>
            </div>
            <p className="text-4xl font-bold text-foreground">
              $29{" "}
              <span className="text-sm font-medium text-muted-foreground">
                / month
              </span>
            </p>
            <ul className="space-y-3 pt-2 border-t border-border/70">
              {PREMIUM_FEATURES.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2.5 text-sm text-foreground/90"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {isPremium ? (
            <div className="py-3 rounded-full bg-primary-subtle text-primary text-center text-xs font-bold">
              Premium Plan Active
            </div>
          ) : (
            <div className="space-y-2.5">
              <Link
                href="/pricing"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md transition-all"
              >
                <span>Upgrade to Premium</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>
                  Stripe Checkout integration ready for payment activation.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function VendorSubscriptionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/vendor/subscription");
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
      badge="Subscription"
      title="Vendor Subscription Plan"
      description="View your current plan quota or upgrade to Premium for unlimited active wedding services."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <SubscriptionContent />
      </Suspense>
    </DashboardShell>
  );
}
