import {
  AlertCircle,
  ArrowLeft,
  Check,
  Crown,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ServiceBookingCard, ServiceGallery } from "@/components/services";
import { getPublicServiceById } from "@/crud/read/getPublicServiceById";
import { auth } from "@/lib/auth";
import { ServicesSkeleton } from "@/suspense/services-skeleton";

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPublicServiceById(id);

  if (!result.data) {
    return {
      title: "Service Unavailable | WedPlan",
    };
  }

  return {
    title: `${result.data.serviceName} | WedPlan`,
    description: result.data.description,
  };
}

async function ServiceDetailsContent({
  id,
  userRole,
  userId,
  userEmail,
}: {
  id: string;
  userRole: string;
  userId: string;
  userEmail: string;
}) {
  const result = await getPublicServiceById(id);
  const service = result.data;

  // Invalid or unavailable service ID shows a clear error card per spec
  if (!service) {
    return (
      <section className="bg-background py-16">
        <div className="mx-auto max-w-xl px-4 text-center space-y-5">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Service Not Available
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.message ||
                "The requested wedding service ID is invalid, paused, or not yet approved."}
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse Services</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Browse Services</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <ServiceGallery
              images={service.images}
              serviceName={service.serviceName}
            />

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold">
                  {service.category}
                </span>
                {service.vendorIsPremium && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Premium Vendor</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {service.serviceName}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{service.location}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-7 space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                About This Service
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Package Highlights */}
            {service.highlights.length > 0 && (
              <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-7 space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  What&apos;s Included
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 text-sm text-foreground/90"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vendor Card */}
            <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Wedding Vendor</span>
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  {service.vendorName}
                </h2>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>{service.vendorEmail}</span>
                </p>
              </div>

              {service.vendorPhone && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background text-sm font-medium text-foreground shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{service.vendorPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Sidebar */}
          <div className="lg:col-span-4">
            <ServiceBookingCard
              serviceId={service.id}
              serviceName={service.serviceName}
              price={service.price}
              defaultLocation={service.location}
              vendorId={service.vendorId}
              vendorName={service.vendorName}
              vendorEmail={service.vendorEmail}
              userRole={userRole}
              userId={userId}
              userEmail={userEmail}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params;

  // Enforce server-side authentication before viewing service details & booking
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/services/${id}`)}`);
  }

  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }

  const userRole =
    typeof session.user.role === "string" ? session.user.role : "user";

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <ServicesSkeleton />
        </div>
      }
    >
      <ServiceDetailsContent
        id={id}
        userRole={userRole}
        userId={session.user.id}
        userEmail={session.user.email}
      />
    </Suspense>
  );
}
