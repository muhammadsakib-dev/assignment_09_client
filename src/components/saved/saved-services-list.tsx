"use client";

import {
  AlertCircle,
  ArrowRight,
  Heart,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeSavedService } from "@/crud/delete/removeSavedService";
import type { SavedServiceRecord } from "@/crud/saved.types";

interface SavedServicesListProps {
  items: SavedServiceRecord[];
  errorMessage?: string;
}

export function SavedServicesList({
  items,
  errorMessage,
}: SavedServicesListProps) {
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (serviceId: string) => {
    setRemovingId(serviceId);
    try {
      const res = await removeSavedService(serviceId);
      if (res.success) {
        router.refresh();
      }
    } finally {
      setRemovingId(null);
    }
  };

  if (errorMessage) {
    return (
      <div className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 flex items-start gap-3 text-sm text-destructive">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Unable to Load Saved Services</p>
          <p className="text-xs opacity-90 mt-1">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/70 p-12 text-center space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-foreground">
            No Saved Services Yet
          </h2>
          <p className="text-sm text-muted-foreground">
            Tap the heart icon on any wedding venue, photographer, or vendor to
            shortlist your favorites here.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all"
        >
          Explore Wedding Services
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs hover:shadow-md transition-all"
        >
          <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
            {item.serviceImage && (
              <Image
                src={item.serviceImage}
                alt={item.serviceName}
                fill
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
                className="object-cover"
              />
            )}
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-md text-foreground text-[11px] font-semibold">
              {item.serviceCategory}
            </span>
            <button
              type="button"
              disabled={removingId === item.serviceId}
              onClick={() => handleRemove(item.serviceId)}
              aria-label={`Remove ${item.serviceName} from saved`}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 hover:bg-destructive hover:text-white text-destructive border border-border flex items-center justify-center transition-colors cursor-pointer"
            >
              {removingId === item.serviceId ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium truncate">
                {item.vendorName}
              </p>
              <h3 className="text-base font-bold text-foreground line-clamp-2">
                {item.serviceName}
              </h3>
              {item.location && (
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{item.location}</span>
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-border/70 flex items-center justify-between gap-2">
              <p className="text-base font-bold text-foreground">
                ${item.price.toLocaleString()}
              </p>
              <Link
                href={`/services/${item.serviceId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-subtle hover:bg-primary text-primary hover:text-primary-foreground text-xs font-semibold transition-all"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
