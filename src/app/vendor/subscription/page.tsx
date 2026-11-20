import { CreditCard, Crown } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { VendorSubscriptionPlans } from "@/components/vendor";
import { getProfile } from "@/crud/read/getProfile";
import { getVendorServices } from "@/crud/read/getVendorServices";
import { getVendorTransactions } from "@/crud/read/getVendorTransactions";
import { auth } from "@/lib/auth";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Subscription Plans | Vendor Portal | WedPlan",
  description:
    "Compare Free and Premium vendor subscription tiers and upgrade for unlimited wedding service listings.",
};

async function SubscriptionContent() {
  const [profileRes, servicesRes, transactionsRes] = await Promise.all([
    getProfile(),
    getVendorServices(),
    getVendorTransactions(),
  ]);

  const isPremium = profileRes.data?.subscriptionPlan === "premium";
  const expiresAt = profileRes.data?.subscriptionExpiresAt ?? null;
  const activeServices = (servicesRes.data ?? []).filter(
    (s) => s.isActive && s.status !== "rejected",
  ).length;
  const transactions = transactionsRes.data ?? [];

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

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
              ? formattedExpiry
                ? `Unlimited active listings & Premium Vendor Badge active through ${formattedExpiry}.`
                : "You have unlimited active service listings and the Premium Vendor Badge enabled."
              : `You are currently using ${activeServices} of 3 active service slots on the Free Plan.`}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border text-xs font-bold text-foreground shrink-0">
          <Crown className="w-4 h-4 text-primary" />
          <span>{isPremium ? "Premium Active" : "Free Tier"}</span>
        </span>
      </div>

      {/* Plan Comparison & Vendor-Only Stripe Checkout */}
      <VendorSubscriptionPlans isPremium={isPremium} />

      {/* Vendor Billing History */}
      {transactions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              My Payment History
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Plan</th>
                  <th className="px-5 py-3.5">Billing</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/20">
                    <td className="px-5 py-4 capitalize font-semibold text-foreground">
                      {tx.plan}
                    </td>
                    <td className="px-5 py-4 capitalize text-muted-foreground">
                      {tx.billingCycle}
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">
                      ${tx.amount.toLocaleString()}{" "}
                      <span className="uppercase text-xs text-muted-foreground font-normal">
                        {tx.currency}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          tx.status === "succeeded"
                            ? "bg-primary-subtle text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
      badge="Vendor Subscription"
      title="Vendor Subscription Plans"
      description="Compare plan quotas, review your payment receipts, or upgrade to Premium via Stripe Checkout."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <SubscriptionContent />
      </Suspense>
    </DashboardShell>
  );
}
