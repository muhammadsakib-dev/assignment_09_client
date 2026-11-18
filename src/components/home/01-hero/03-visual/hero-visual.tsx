import { CalendarCheck2, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import { FloatCard, ScaleReveal } from "../01-motion/hero-motion";
import { HERO_DATA } from "../hero-data";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Decorative soft radial backdrop behind portrait */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-linear-to-tr from-primary/15 via-blush-pink/20 to-champagne/30 blur-2xl dark:from-primary/20 dark:via-primary/10 dark:to-transparent"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Primary Arched Editorial Wedding Portrait */}
        <ScaleReveal delay={0.12}>
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-t-[10rem] rounded-b-3xl border-4 border-card bg-muted shadow-2xl">
            <Image
              src={HERO_DATA.images.primary}
              alt="Couple celebrating their luxury wedding day"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />

            {/* Subtle editorial caption inside portrait */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 text-white">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-white/80">
                  Featured Celebration
                </p>
                <p className="text-base font-semibold">
                  Curated Venues &amp; Visual Storytellers
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-current text-champagne" />
                <span>4.9</span>
              </div>
            </div>
          </div>
        </ScaleReveal>

        {/* Overlapping Secondary Detail Card (Hidden on very small screens to keep mobile clean) */}
        <ScaleReveal
          delay={0.28}
          className="hidden sm:block absolute -left-8 bottom-14 w-36 md:w-40"
        >
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-xl">
            <Image
              src={HERO_DATA.images.secondary}
              alt="Elegant floral wedding ceremony decor"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        </ScaleReveal>

        {/* Floating Glassmorphic Proof Card (Top Right) */}
        <FloatCard
          delay={0.35}
          className="absolute -right-2 sm:-right-5 top-8 sm:top-12 z-10"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-card/92 backdrop-blur-xl border border-border/80 px-4 py-3 shadow-xl">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-subtle text-primary shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                100% Verified Vendors
              </p>
              <p className="text-[11px] text-muted-foreground">
                Handpicked &amp; quality reviewed
              </p>
            </div>
          </div>
        </FloatCard>

        {/* Floating Booking Pill (Bottom Right) */}
        <FloatCard
          delay={0.5}
          className="hidden sm:block absolute -bottom-5 right-6 z-10"
        >
          <div className="flex items-center gap-2.5 rounded-full bg-card/95 backdrop-blur-xl border border-border px-4 py-2 shadow-lg">
            <CalendarCheck2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">
              Seamless Date Booking
            </span>
          </div>
        </FloatCard>
      </div>
    </div>
  );
}
