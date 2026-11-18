import {
  ArrowRight,
  type LucideIcon,
  PartyPopper,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ABOUT_DATA, type AboutStepIcon } from "../about-data";

const STEP_ICONS: Record<AboutStepIcon, LucideIcon> = {
  search: Search,
  send: Send,
  celebrate: PartyPopper,
};

interface AboutStepsProps {
  showCtaBanner?: boolean;
}

export function AboutSteps({ showCtaBanner = true }: AboutStepsProps) {
  const { stepsSection } = ABOUT_DATA;
  const { cta } = stepsSection;

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{stepsSection.badge}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {stepsSection.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {stepsSection.description}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stepsSection.steps.map((item) => {
            const Icon = STEP_ICONS[item.icon];
            return (
              <div
                key={item.step}
                className="relative rounded-3xl border border-border/80 bg-card p-7 space-y-4 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-bold tracking-tight text-primary/20 select-none">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Dual CTA Banner */}
        {showCtaBanner && (
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 text-center space-y-6 shadow-sm">
            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {cta.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {cta.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href={cta.primaryHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg transition-all group"
              >
                <span>{cta.primaryLabel}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={cta.secondaryHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-border bg-background hover:bg-muted text-foreground text-sm font-semibold transition-all"
              >
                <span>{cta.secondaryLabel}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
