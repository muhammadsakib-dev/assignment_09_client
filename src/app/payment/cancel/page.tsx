import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Payment Cancelled | WedPlan",
  description:
    "Your Stripe checkout process was cancelled and no charges were made.",
};

export default async function PaymentCancelPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md mx-auto space-y-7 text-center">
        {/* Cancelled Icon */}
        <div className="mx-auto size-20 flex items-center justify-center rounded-3xl bg-muted/60 border border-border text-muted-foreground shadow-xs">
          <XCircle className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Payment Cancelled
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The checkout session was cancelled. No charges were made to your
            card, and your vendor account remains active on the{" "}
            <span className="font-semibold text-foreground">Free Plan</span> (up
            to 3 active services).
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl border border-border bg-card p-5 text-left text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">
            Want to upgrade later?
          </p>
          <p>
            You can upgrade to Premium anytime from your Vendor Subscription tab
            whenever you need more than 3 active listings or want the verified
            badge.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/vendor/subscription"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Link>

          <Link
            href="/vendor/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted/40 text-foreground text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
