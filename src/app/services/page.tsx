import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ServicesExplorer } from "@/components/services";
import { auth } from "@/lib/auth";
import { getPublicServices } from "@/services/read/getPublicServices";
import { getSavedServices } from "@/services/read/getSavedServices";
import { ServicesSkeleton } from "@/suspense/services-skeleton";

export const metadata: Metadata = {
  title: "Browse Wedding Services | WedPlan",
  description:
    "Explore approved wedding photographers, venues, florists, caterers, makeup artists, and bridal fashion on WedPlan.",
};

async function ServicesContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isCustomer = session?.user && (session.user.role || "user") === "user";

  const [result, savedResult] = await Promise.all([
    getPublicServices(),
    isCustomer
      ? getSavedServices()
      : Promise.resolve({ success: true, data: [] }),
  ]);

  const savedServiceIds = (savedResult.data ?? []).map(
    (item) => item.serviceId,
  );

  return (
    <ServicesExplorer
      initialServices={result.services}
      savedServiceIds={savedServiceIds}
      errorMessage={result.success ? undefined : result.message}
    />
  );
}

export default function ServicesPage() {
  return (
    <section className="relative overflow-hidden bg-background py-10 sm:py-14">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[34rem] h-72 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Wedding Directory</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Browse Wedding Services
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Discover approved, active wedding professionals across every
            category and city. Filter by location, budget, or style to find your
            perfect match.
          </p>
        </div>

        <Suspense fallback={<ServicesSkeleton />}>
          <ServicesContent />
        </Suspense>
      </div>
    </section>
  );
}
