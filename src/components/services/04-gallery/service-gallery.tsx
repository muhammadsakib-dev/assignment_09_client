"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_SERVICE_IMAGE =
  "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_01.jpg";

interface ServiceGalleryProps {
  images: string[];
  serviceName: string;
}

export function ServiceGallery({ images, serviceName }: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const validImages =
    images && images.length > 0
      ? images.filter((img) => img && img.trim().startsWith("http"))
      : [];
  const galleryList =
    validImages.length > 0 ? validImages : [DEFAULT_SERVICE_IMAGE];
  const currentImage = galleryList[activeIndex] || galleryList[0];

  return (
    <div className="space-y-3.5">
      {/* Main Showcase Image */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-md">
        <Image
          src={currentImage}
          alt={serviceName}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 95vw"
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnail Strip */}
      {galleryList.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {galleryList.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`View photo ${idx + 1} of ${serviceName}`}
              className={cn(
                "relative aspect-4/3 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer",
                activeIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/70 opacity-75 hover:opacity-100",
              )}
            >
              <Image
                src={img}
                alt={`${serviceName} preview ${idx + 1}`}
                fill
                sizes="180px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
