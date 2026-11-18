import { Sparkles } from "lucide-react";
import Image from "next/image";
import { ABOUT_DATA } from "../about-data";

export function AboutStory() {
  const { story } = ABOUT_DATA;

  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-20">
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{story.badge}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {story.title}
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed">
              {story.description}
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {story.secondaryText}
            </p>

            {/* Milestones Grid */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/70">
              {story.milestones.map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <p className="text-2xl font-bold text-primary">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-xl">
              <Image
                src={story.imageSrc}
                alt="WedPlan curated wedding celebration"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 94vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
