import { ArrowRight, Crown, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { VendorServiceRecord } from "@/crud/vendor-services.types";
import { SaveServiceButton } from "./save-service-button";

interface ServiceCardProps {
  service: VendorServiceRecord;
  initialSaved?: boolean;
}

export function ServiceCard({
  service,
  initialSaved = false,
}: ServiceCardProps) {
  const coverImage =
    service.images[0] ||
    "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_01.jpg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      {/* Cover Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={coverImage}
          alt={service.serviceName}
          fill
          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 94vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />

        {/* Top Badges & Save Button */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-card/92 backdrop-blur-md text-foreground text-[11px] font-semibold shadow-xs truncate max-w-[65%]">
            {service.category}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {service.vendorIsPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shadow-sm shrink-0">
                <Crown className="w-3 h-3" />
                <span>Premium</span>
              </span>
            )}
            <SaveServiceButton
              serviceId={service.id}
              serviceName={service.serviceName}
              initialSaved={initialSaved}
            />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium truncate">{service.vendorName}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {service.serviceName}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary/80 shrink-0" />
            <span>{service.location}</span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="pt-4 border-t border-border/70 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              Starting from
            </p>
            <p className="text-lg font-bold text-foreground">
              ${service.price.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/services/${service.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary-subtle hover:bg-primary text-primary hover:text-primary-foreground text-xs font-semibold transition-all group/btn shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
