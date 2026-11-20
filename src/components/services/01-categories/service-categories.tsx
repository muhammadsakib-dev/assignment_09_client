import {
  ArrowRight,
  Building2,
  Camera,
  Flower2,
  type LucideIcon,
  Shirt,
  Sparkles,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { getPublicServices } from "@/crud/read/getPublicServices";
import { type CategoryIconName, SERVICE_CATEGORIES } from "../services-data";

const CATEGORY_ICONS: Record<CategoryIconName, LucideIcon> = {
  camera: Camera,
  venue: Building2,
  florist: Flower2,
  catering: Utensils,
  makeup: Sparkles,
  fashion: Shirt,
};

export async function ServiceCategories() {
  const { categoryCounts } = await getPublicServices({ limit: 1 });

  return (
    <section className="bg-muted/35 border-y border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wedding Categories</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Explore Services by Category
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Find specialized wedding professionals tailored to every part of
              your celebration.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors group shrink-0"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Category Cards with live MongoDB counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            const count = categoryCounts[category.name] ?? 0;

            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group flex items-start gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-xs hover:shadow-md hover:border-primary/40 transition-all"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {category.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-semibold shrink-0">
                      {count}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
