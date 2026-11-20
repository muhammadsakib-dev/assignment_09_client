import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutSteps, AboutValues } from "@/components/about";
import { Hero } from "@/components/home";
import { FeaturedServices, ServiceCategories } from "@/components/services";
import { ServicesSkeleton } from "@/suspense/services-skeleton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WedPlan | Plan, Book & Celebrate Your Dream Wedding",
  description:
    "Discover verified wedding venues, photographers, florists, caterers, and stylists on WedPlan.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Suspense fallback={null}>
        <ServiceCategories />
      </Suspense>
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <ServicesSkeleton />
          </div>
        }
      >
        <FeaturedServices />
      </Suspense>
      <AboutValues />
      <AboutSteps />
    </div>
  );
}
