import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Crown,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { getCheckoutSession } from "@/crud/read/getCheckoutSession";
import { auth } from "@/lib/auth";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Payment Confirmed | Vendor Portal | WedPlan",
  description:
    "View your Stripe Checkout confirmation and verified WedPlan Premium vendor subscription status.",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

async function PaymentSuccessContent({
  sessionId,
  vendorName,
}: {
  sessionId?: string;
  vendorName: string;
}) {
  if (!sessionId) {
    return (
      <div className="max-w-xl mx-auto py-8 text-center space-y-6">
        <div className="mx-auto size-16 flex items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Missing Checkout Session
          </h2>
          <p className="text-sm text-muted-foreground">
            No Stripe Checkout session reference was found in this URL. Premium
            access is activated upon verified Stripe checkout confirmation.
          </p>
        </div>
        <Link
          href="/vendor/subscription"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all"
        >
          <span>View Subscription Status</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const verificationRes = await getCheckoutSession(sessionId);

  if (!verificationRes.success || !verificationRes.data) {
    return (
      <div className="max-w-xl mx-auto py-8 text-center space-y-6">
        <div className="mx-auto size-16 flex items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Could Not Verify Payment Session
          </h2>
          <p className="text-sm text-muted-foreground">
            {verificationRes.message ||
              "This checkout session could not be verified for your vendor account."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/payment/success?session_id=${encodeURIComponent(sessionId)}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card hover:bg-muted/40 text-foreground text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Verification</span>
          </Link>
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all"
          >
            <span>Go to Subscription</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const paymentData = verificationRes.data;
  const isWebhookVerified = paymentData.webhookVerified;

  return (
    <div className="max-w-xl mx-auto py-4 space-y-8 text-center">
      {/* Status Icon */}
      <div className="relative mx-auto size-20 flex items-center justify-center rounded-3xl bg-primary-subtle border border-primary/20 text-primary shadow-sm">
        <Crown className="w-10 h-10 text-primary" />
        <span className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-4 ring-background">
          {isWebhookVerified ? (
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Clock className="w-4 h-4 stroke-[2.5]" />
          )}
        </span>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isWebhookVerified
              ? "Premium Tier Activated"
              : "Confirming Webhook"}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {isWebhookVerified
            ? "Subscription Confirmed!"
            : "Payment Received — Finalizing..."}
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {isWebhookVerified ? (
            <>
              Thank you for upgrading,{" "}
              <span className="font-semibold text-foreground">
                {vendorName}
              </span>
              . Your Stripe payment has been confirmed and unlimited service
              listings are now active.
            </>
          ) : (
            <>
              Stripe received your checkout submission. Your Premium access will
              activate automatically as soon as the cryptographically signed
              Stripe webhook completes.
            </>
          )}
        </p>
      </div>

      {/* Transaction Summary Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs text-left space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Plan
            </p>
            <p className="text-base font-bold text-foreground capitalize">
              WedPlan {paymentData.plan} ({paymentData.billingCycle})
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isWebhookVerified ? "Webhook Verified" : "Pending Webhook"}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              ${paymentData.amount.toLocaleString()}{" "}
              <span className="uppercase text-xs text-muted-foreground font-normal">
                {paymentData.currency}
              </span>
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Listing Quota</p>
            <p className="text-sm font-bold text-primary mt-0.5">
              {isWebhookVerified
                ? "Unlimited Active Services"
                : "Activating Upon Webhook"}
            </p>
          </div>
          <div className="col-span-2 pt-2 border-t border-border/60">
            <p className="text-muted-foreground">Stripe Session ID</p>
            <p className="font-mono text-[11px] text-muted-foreground/80 break-all mt-0.5">
              {paymentData.sessionId}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {!isWebhookVerified && (
          <Link
            href={`/payment/success?session_id=${encodeURIComponent(sessionId)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border bg-card hover:bg-muted/40 text-foreground text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </Link>
        )}

        <Link
          href="/vendor/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md transition-all"
        >
          <span>Vendor Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/vendor/add-service"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border bg-card hover:bg-muted/40 text-foreground text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Service</span>
        </Link>
      </div>
    </div>
  );
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
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

  const { session_id } = await searchParams;

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: "vendor",
      }}
      badge="Payment Receipt"
      title="Subscription Confirmation"
      description="Verified Stripe Checkout receipt and Premium tier activation status for your vendor account."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <PaymentSuccessContent
          sessionId={session_id}
          vendorName={session.user.name}
        />
      </Suspense>
    </DashboardShell>
  );
}
