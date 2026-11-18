import { HelpCircle } from "lucide-react";
import { PRICING_DATA } from "../pricing-data";

export function PricingFaq() {
  return (
    <div className="max-w-4xl mx-auto pt-12 border-t border-border/70">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground">
          Everything you need to know about WedPlan plans and vendor billing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {PRICING_DATA.faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-2xl border border-border/80 bg-card/70 p-6 space-y-2"
          >
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
              <h3 className="text-sm font-semibold text-foreground leading-snug">
                {faq.question}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6.5">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
