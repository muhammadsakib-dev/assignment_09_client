import type { Metadata } from "next";
import { AboutSection } from "@/components/about";

export const metadata: Metadata = {
  title: "About Us | WedPlan",
  description:
    "Learn how WedPlan connects couples with verified wedding venues, photographers, florists, and caterers for an effortless celebration.",
};

export default function AboutPage() {
  return <AboutSection />;
}
