import type { Metadata } from "next";
import { PricingSection } from "@/components/pricing";

export const metadata: Metadata = {
  title: "Pricing & Vendor Plans | WedPlan",
  description:
    "Explore WedPlan Free and Premium vendor subscription plans. Always 100% free for couples planning their dream wedding.",
};

export default function PricingPage() {
  return <PricingSection />;
}
