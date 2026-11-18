"use client";

import { ArrowRight, Check, Crown } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PRICING_DATA } from "../pricing-data";

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const isYearly = billingCycle === "yearly";

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-10">
        {/* Monthly / Yearly Toggle */}
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="Billing cycle"
            className="inline-flex items-center p-1.5 rounded-full bg-muted/70 border border-border shadow-2xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isYearly}
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer",
                !isYearly
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isYearly}
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2",
                isYearly
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-subtle text-primary text-[11px] font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {PRICING_DATA.plans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                  ease: SMOOTH_EASE,
                }}
                className={cn(
                  "relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 border transition-all",
                  plan.highlighted
                    ? "bg-card border-primary/50 shadow-xl ring-1 ring-primary/15"
                    : "bg-card/80 border-border shadow-sm hover:shadow-md",
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price Display */}
                  <div className="mt-6 pb-6 border-b border-border/80 flex items-baseline gap-1.5">
                    <motion.span
                      key={`${plan.id}-${billingCycle}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
                    >
                      ${price}
                    </motion.span>
                    <span className="text-sm text-muted-foreground font-medium">
                      {price === 0 ? "/ forever" : "/ month"}
                    </span>
                    {price > 0 && isYearly && (
                      <span className="ml-auto text-xs font-medium text-primary">
                        Billed ${price * 12}/yr
                      </span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-foreground/90"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                            plan.highlighted
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary-subtle text-primary",
                          )}
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan CTA */}
                <div className="mt-8 pt-2">
                  <Link
                    href={plan.ctaHref}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all group",
                      plan.highlighted
                        ? "bg-primary hover:bg-primary-hover text-primary-foreground shadow-md hover:shadow-lg"
                        : "border border-border bg-background hover:bg-muted text-foreground",
                    )}
                  >
                    <span>{plan.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MotionConfig>
  );
}
