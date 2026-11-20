import { ArrowRight, Sparkles } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { getPublicServices } from "@/crud/read/getPublicServices";
import { getSavedServices } from "@/crud/read/getSavedServices";
import { auth } from "@/lib/auth";
import { ServiceCard } from "../03-card/service-card";

export async function FeaturedServices() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isCustomer = session?.user && (session.user.role || "user") === "user";

  const [{ services: featured }, savedResult] = await Promise.all([
    getPublicServices({ limit: 6 }),
    isCustomer
      ? getSavedServices()
      : Promise.resolve({ success: true, data: [] }),
  ]);

  const savedSet = new Set(
    (savedResult.data ?? []).map((item) => item.serviceId),
  );

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Selection</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Featured Wedding Services
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Approved, active wedding venues, photographers, florists, and
              culinary teams published directly by verified vendors.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground transition-all group shrink-0"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Live MongoDB Services Grid or Empty State */}
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                initialSaved={savedSet.has(service.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card/70 p-10 text-center space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-foreground">
                No Approved Services Published Yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Vendors can publish wedding services from the Vendor Dashboard.
                Once approved by an Admin, they appear here automatically.
              </p>
            </div>
            <Link
              href="/for-vendors"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all"
            >
              Become a Vendor &amp; List Service
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
