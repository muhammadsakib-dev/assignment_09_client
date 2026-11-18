import {
  BadgeDollarSign,
  CalendarCheck2,
  Layers,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ABOUT_DATA, type AboutValueIcon } from "../about-data";

const VALUE_ICONS: Record<AboutValueIcon, LucideIcon> = {
  shield: ShieldCheck,
  pricing: BadgeDollarSign,
  calendar: CalendarCheck2,
  layers: Layers,
};

export function AboutValues() {
  const { valuesSection } = ABOUT_DATA;

  return (
    <section className="bg-muted/35 border-y border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{valuesSection.badge}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {valuesSection.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {valuesSection.description}
          </p>
        </div>

        {/* 4 Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {valuesSection.items.map((item) => {
            const Icon = VALUE_ICONS[item.icon];
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-xs hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">
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
      </div>
    </section>
  );
}
