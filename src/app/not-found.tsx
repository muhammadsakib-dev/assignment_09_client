import { Home, Search, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - This page could not be found | WedPlan",
  description:
    "The wedding venue, vendor, or page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden select-none">
      {/* Decorative ambient background glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl mx-auto text-center relative z-10 space-y-8">
        {/* Large 404 Headline with subtle romantic badge */}
        <div className="relative inline-block">
          <span
            className="text-8xl sm:text-9xl font-black tracking-tighter text-primary/15 dark:text-primary/25 select-none"
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Page Not Found</span>
            </span>
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            This page could not be found.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            We searched every aisle, but the page, wedding vendor, or
            celebration you are looking for does not exist or may have been
            moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-medium text-sm transition-all shadow-xs hover:border-foreground/30 cursor-pointer"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span>Browse All Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
