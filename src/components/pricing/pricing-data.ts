export interface PricingPlan {
  id: "free" | "premium";
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
}

export interface PricingFaqItem {
  question: string;
  answer: string;
}

export const PRICING_DATA = {
  badge: "Transparent Vendor Plans",
  title: "Simple Pricing Built to Grow Your Wedding Business",
  description:
    "Start showcasing your wedding services for free, and upgrade to Premium anytime for unlimited listings and standout visibility.",
  plans: [
    {
      id: "free",
      name: "Free Plan",
      tagline: "Ideal for independent wedding professionals getting started.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      ctaLabel: "Start Free as Vendor",
      ctaHref: "/for-vendors",
      features: [
        "Publish up to 3 active wedding services",
        "Basic Vendor Dashboard access",
        "Receive & manage customer booking requests",
        "Public vendor profile & portfolio gallery",
        "Standard placement in Browse Services",
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      tagline:
        "Built for studios, venues, and established wedding teams scaling fast.",
      monthlyPrice: 29,
      yearlyPrice: 23,
      badge: "Most Popular",
      highlighted: true,
      ctaLabel: "Upgrade to Premium",
      ctaHref: "/for-vendors?plan=premium",
      features: [
        "Publish unlimited active wedding services",
        "Exclusive Premium Vendor Badge on listings",
        "Priority placement across search & categories",
        "All Free Plan features & booking management",
        "Instant activation via secure Stripe Checkout",
      ],
    },
  ] satisfies PricingPlan[],
  coupleNotice: {
    title: "Planning Your Wedding? WedPlan Is 100% Free for Couples.",
    description:
      "Browse verified venues and vendors, save your favorite services, and send booking requests with zero platform fees.",
    ctaLabel: "Explore Wedding Services",
    ctaHref: "/services",
  },
  faqs: [
    {
      question: "How many services can I publish on the Free Plan?",
      answer:
        "Free Plan vendors can publish up to 3 active wedding services at once. You can edit or pause listings anytime from your Vendor Dashboard.",
    },
    {
      question: "What happens when I upgrade to Premium?",
      answer:
        "Your account unlocks unlimited service listings and receives the Premium Vendor Badge immediately after Stripe confirms your payment.",
    },
    {
      question: "Do couples have to pay to use WedPlan?",
      answer:
        "Never. Discovering wedding services, saving favorites, and sending booking requests is completely free for couples.",
    },
    {
      question: "Can I cancel or switch plans later?",
      answer:
        "Yes. You can manage your subscription directly from your Vendor Dashboard with no hidden lock-in fees.",
    },
  ] satisfies PricingFaqItem[],
} as const;
