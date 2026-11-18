export interface HeroStat {
  value: string;
  label: string;
}

export const HERO_DATA = {
  badge: "Plan • Book • Celebrate",
  titleStart: "Craft Your Dream",
  titleHighlight: "Wedding",
  titleEnd: ", Effortlessly.",
  description:
    "Discover verified venues, visionary photographers, bespoke florists, and culinary experts—curated to bring every detail of your celebration together.",
  primaryCta: {
    label: "Explore Wedding Services",
    href: "/services",
  },
  secondaryCta: {
    label: "Become a Vendor",
    href: "/for-vendors",
  },
  categories: [
    "All Categories",
    "Photography & Videography",
    "Wedding Venues",
    "Decoration & Florist",
    "Catering Services",
    "Makeup & Styling",
    "Wedding Fashion",
  ],
  stats: [
    { value: "500+", label: "Verified Vendors" },
    { value: "2,400+", label: "Weddings Planned" },
    { value: "4.9★", label: "Couple Rating" },
  ] satisfies HeroStat[],
  images: {
    primary:
      "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_01.jpg",
    secondary:
      "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_02.png",
  },
} as const;
