export type AboutValueIcon = "shield" | "pricing" | "calendar" | "layers";

export interface AboutValueItem {
  title: string;
  description: string;
  icon: AboutValueIcon;
}

export type AboutStepIcon = "search" | "send" | "celebrate";

export interface AboutStepItem {
  step: string;
  title: string;
  description: string;
  icon: AboutStepIcon;
}

export interface AboutMilestone {
  value: string;
  label: string;
}

export const ABOUT_DATA = {
  story: {
    badge: "About WedPlan",
    title: "Making Every Wedding Journey Calm, Joyful & Unforgettable",
    description:
      "WedPlan was created to take the stress out of wedding planning. We bring couples and trusted wedding professionals together in one transparent marketplace—so you spend less time chasing quotes and more time celebrating.",
    secondaryText:
      "Whether you are looking for an intimate garden venue, cinematic storytellers, floral designers, or full-scale catering, every vendor on WedPlan is reviewed for reliability and craftsmanship.",
    imageSrc:
      "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_02.png",
    milestones: [
      { value: "500+", label: "Verified Vendors" },
      { value: "2,400+", label: "Dream Weddings" },
      { value: "6", label: "Curated Categories" },
      { value: "4.9★", label: "Average Rating" },
    ] satisfies AboutMilestone[],
  },
  valuesSection: {
    badge: "Why Choose WedPlan?",
    title: "Built Around Trust, Clarity & Effortless Planning",
    description:
      "From discovering premier talent to tracking every booking request, WedPlan gives couples and vendors the clarity they deserve.",
    items: [
      {
        title: "100% Verified Vendors",
        description:
          "Every published service goes through admin review so you connect only with authentic, active wedding professionals.",
        icon: "shield",
      },
      {
        title: "Transparent Packages",
        description:
          "Compare clear starting prices, locations, and real portfolios upfront without hidden fees or endless back-and-forth.",
        icon: "pricing",
      },
      {
        title: "Seamless Booking Requests",
        description:
          "Pick your wedding date, add event notes, and track vendor responses in real time right from your dashboard.",
        icon: "calendar",
      },
      {
        title: "6 Essential Categories",
        description:
          "Photography, venues, florists, catering, bridal styling, and wedding fashion—all organized in one place.",
        icon: "layers",
      },
    ] satisfies AboutValueItem[],
  },
  stepsSection: {
    badge: "How WedPlan Works",
    title: "From First Inspiration to Your Big Day in Three Steps",
    description:
      "A simple, guided workflow designed so couples book with confidence and vendors stay organized.",
    steps: [
      {
        step: "01",
        title: "Discover & Compare",
        description:
          "Filter verified wedding services by category, location, and budget, and save your top favorites.",
        icon: "search",
      },
      {
        step: "02",
        title: "Send Booking Request",
        description:
          "Select your wedding date, share event details, and submit booking requests directly to your chosen vendors.",
        icon: "send",
      },
      {
        step: "03",
        title: "Celebrate Effortlessly",
        description:
          "Track confirmations in your dashboard and enjoy a stress-free celebration backed by top professionals.",
        icon: "celebrate",
      },
    ] satisfies AboutStepItem[],
    cta: {
      title: "Ready to Start Planning Your Celebration?",
      description:
        "Explore curated wedding professionals or showcase your business to thousands of engaged couples.",
      primaryLabel: "Explore Wedding Services",
      primaryHref: "/services",
      secondaryLabel: "Join as a Vendor",
      secondaryHref: "/for-vendors",
    },
  },
} as const;
