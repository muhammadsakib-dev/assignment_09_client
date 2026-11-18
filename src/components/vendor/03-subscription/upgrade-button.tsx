"use client";

import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { createCheckoutSession } from "@/services/create/createCheckoutSession";

interface UpgradeToPremiumButtonProps {
  className?: string;
}

export function UpgradeToPremiumButton({
  className = "",
}: UpgradeToPremiumButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await createCheckoutSession();

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

      // Redirect to Stripe Checkout page
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
      className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to Stripe...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>Upgrade to Premium</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
