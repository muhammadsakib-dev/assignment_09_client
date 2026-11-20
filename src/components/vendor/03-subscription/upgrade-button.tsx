"use client";

import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import type { BillingCycle } from "@/crud/checkout.types";
import { createCheckoutSession } from "@/crud/create/createCheckoutSession";

interface UpgradeToPremiumButtonProps {
  billingCycle?: BillingCycle;
  label?: string;
  className?: string;
}

export function UpgradeToPremiumButton({
  billingCycle = "monthly",
  label = "Upgrade to Premium",
  className = "",
}: UpgradeToPremiumButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await createCheckoutSession(billingCycle);

      if (!res.success || !res.data?.url) {
        toast.add({
          title: "Upgrade Failed",
          description:
            res.message ||
            "Failed to initialize Stripe checkout. Please try again.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      // Redirect vendor to Stripe Checkout page
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.add({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      disabled={loading}
      className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to Stripe...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>{label}</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
