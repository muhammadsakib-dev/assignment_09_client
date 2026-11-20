import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Payment Cancelled | Vendor Portal | WedPlan",
  description:
    "Your Stripe checkout process was cancelled and no charges were made.",
};

export default async function PaymentCancelPage() {
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
      badge="Checkout Cancelled"
      title="Payment Cancelled"
      description="No charges were applied to your card. Your vendor account remains on the Free Plan."
    >
      <div className="max-w-md mx-auto py-8 space-y-7 text-center">
        {/* Cancelled Icon */}
        <div className="mx-auto size-20 flex items-center justify-center rounded-3xl bg-muted/60 border border-border text-muted-foreground shadow-xs">
          <XCircle className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Checkout Was Cancelled
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No charges were made to your card, and your vendor account remains
            active on the{" "}
            <span className="font-semibold text-foreground">Free Plan</span> (up
            to 3 active wedding services).
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl border border-border bg-card p-5 text-left text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">
            Want to upgrade later?
          </p>
          <p>
            You can upgrade to Premium anytime from your Subscription Plans tab
            whenever you need more than 3 active listings or want the Premium
            Vendor Badge.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/vendor/subscription"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Back to Subscription</span>
          </Link>

          <Link
            href="/vendor/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted/40 text-foreground text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Vendor Dashboard</span>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
