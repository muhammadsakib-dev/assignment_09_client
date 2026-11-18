import { ArrowRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { PricingCards } from "./01-cards/pricing-cards";
import { PricingFaq } from "./02-faq/pricing-faq";
import { PRICING_DATA } from "./pricing-data";

export function PricingSection() {
  const { coupleNotice } = PRICING_DATA;

  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-20">
      {/* Subtle Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-72 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{PRICING_DATA.badge}</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            {PRICING_DATA.title}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            {PRICING_DATA.description}
          </p>
        </div>

        {/* Interactive Free vs Premium Vendor Cards */}
        <PricingCards />

        {/* Couple Free Callout Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-primary-subtle/60 dark:bg-primary-subtle/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Heart className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {coupleNotice.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                {coupleNotice.description}
              </p>
            </div>
          </div>

          <Link
            href={coupleNotice.ctaHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary/40 text-foreground hover:text-primary text-sm font-semibold transition-all shrink-0 group"
          >
            <span>{coupleNotice.ctaLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* FAQ Grid */}
        <PricingFaq />
      </div>
    </section>
  );
}

export default PricingSection;
