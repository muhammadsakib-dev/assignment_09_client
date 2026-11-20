"use client";

import { Check, Crown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { BillingCycle } from "@/crud/checkout.types";
import { cn } from "@/lib/utils";
import { UpgradeToPremiumButton } from "./upgrade-button";

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

interface VendorSubscriptionPlansProps {
  isPremium: boolean;
}

export function VendorSubscriptionPlans({
  isPremium,
}: VendorSubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const isYearly = billingCycle === "yearly";

  return (
    <div className="space-y-6">
      {/* Billing Cycle Selector (visible for Free vendors choosing their plan) */}
      {!isPremium && (
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="Subscription billing cycle"
            className="inline-flex items-center p-1.5 rounded-full bg-muted/70 border border-border shadow-2xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isYearly}
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                !isYearly
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly ($29/mo)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isYearly}
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2",
                isYearly
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Yearly ($23/mo)</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-subtle text-primary text-[11px] font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      )}

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

            <div className="flex items-baseline gap-1.5">
              <p className="text-4xl font-bold text-foreground">
                ${isYearly ? 23 : 29}
              </p>
              <span className="text-sm font-medium text-muted-foreground">
                / month
              </span>
              {isYearly && (
                <span className="ml-auto text-xs font-semibold text-primary">
                  Billed $276/yr
                </span>
              )}
            </div>

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
              <UpgradeToPremiumButton
                billingCycle={billingCycle}
                label={
                  isYearly
                    ? "Upgrade to Premium ($276/yr)"
                    : "Upgrade to Premium ($29/mo)"
                }
              />
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>
                  Vendor-only Stripe Checkout — activated strictly via verified
                  webhook.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
