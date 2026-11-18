import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCheckoutSession } from "@/services/read/getCheckoutSession";

export const metadata: Metadata = {
  title: "Payment Successful | WedPlan",
  description:
    "Your WedPlan Premium vendor subscription has been successfully activated.",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect("/login");
  }

  const { session_id } = await searchParams;
  const verificationRes = session_id
    ? await getCheckoutSession(session_id)
    : null;

  const paymentData = verificationRes?.data;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-xl mx-auto space-y-8 text-center">
        {/* Celebration Icon */}
        <div className="relative mx-auto size-20 flex items-center justify-center rounded-3xl bg-primary-subtle border border-primary/20 text-primary shadow-sm">
          <Crown className="w-10 h-10 text-primary" />
          <span className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-4 ring-background">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Tier Activated</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Subscription Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Thank you for upgrading,{" "}
            <span className="font-semibold text-foreground">
              {session.user.name}
            </span>
            . Your vendor account now has unlimited service listings enabled.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs text-left space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Plan
              </p>
              <p className="text-base font-bold text-foreground">
                WedPlan Premium Vendor Plan
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Paid</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Amount Paid</p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                ${paymentData?.amount ?? 29}.00{" "}
                <span className="uppercase text-xs text-muted-foreground font-normal">
                  {paymentData?.currency ?? "usd"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Listing Quota</p>
              <p className="text-sm font-bold text-primary mt-0.5">
                Unlimited Active Services
              </p>
            </div>
            {session_id && (
              <div className="col-span-2 pt-2 border-t border-border/60">
                <p className="text-muted-foreground">Stripe Session ID</p>
                <p className="font-mono text-[11px] text-muted-foreground/80 break-all mt-0.5">
                  {session_id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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
    </div>
  );
}
