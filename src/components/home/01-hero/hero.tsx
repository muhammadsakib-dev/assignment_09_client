import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { FadeUp, HeroMotionProvider } from "./01-motion/hero-motion";
import { HeroSearch } from "./02-search/hero-search";
import { HeroVisual } from "./03-visual/hero-visual";
import { HERO_DATA } from "./hero-data";

export function Hero() {
  return (
    <HeroMotionProvider>
      <section className="relative overflow-hidden bg-background">
        {/* Soft Wedding Ambient Glows */}
        <div
          className="pointer-events-none absolute -top-28 -left-24 size-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-24 size-96 rounded-full bg-champagne/40 dark:bg-primary/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-10 sm:pb-24 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Editorial Headline, Search, CTAs & Social Proof */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <FadeUp delay={0}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{HERO_DATA.badge}</span>
                </span>
              </FadeUp>

              <FadeUp delay={0.08} className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                  {HERO_DATA.titleStart}{" "}
                  <span className="text-primary">
                    {HERO_DATA.titleHighlight}
                  </span>
                  {HERO_DATA.titleEnd}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {HERO_DATA.description}
                </p>
              </FadeUp>

              {/* Quick Service Discovery Bar */}
              <FadeUp
                delay={0.16}
                className="flex justify-center lg:justify-start"
              >
                <HeroSearch />
              </FadeUp>

              {/* Primary & Secondary Action Buttons */}
              <FadeUp
                delay={0.24}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1"
              >
                <Link
                  href={HERO_DATA.primaryCta.href}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg transition-all group"
                >
                  <span>{HERO_DATA.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={HERO_DATA.secondaryCta.href}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold transition-all"
                >
                  <span>{HERO_DATA.secondaryCta.label}</span>
                </Link>
              </FadeUp>

              {/* Trust & Milestone Stats */}
              <FadeUp delay={0.32}>
                <div className="pt-6 border-t border-border/70 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                  {HERO_DATA.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right Column: Editorial Wedding Photo Collage */}
            <div className="lg:col-span-5 lg:pl-4">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>
    </HeroMotionProvider>
  );
}

export default Hero;
