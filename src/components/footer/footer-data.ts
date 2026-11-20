export interface FooterLinkItem {
  label: string;
  href: string;
}

export type SocialPlatform = "facebook" | "instagram" | "youtube" | "linkedin";

export interface FooterSocialItem {
  name: string;
  platform: SocialPlatform;
  href: string;
}

export const FOOTER_DATA = {
  brand: {
    name: "WedPlan",
    logoUrl:
      "https://ik.imagekit.io/muhammadsakib/Assignment_09/WedPlan%20Logo.png",
    description:
      "Plan, book, and celebrate your dream wedding with verified venues, visionary photographers, bespoke florists, and premier culinary experts.",
  },
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "Become a Vendor", href: "/for-vendors" },
    { label: "About Us", href: "/about" },
  ] satisfies FooterLinkItem[],
  serviceLinks: [
    {
      label: "Photography & Videography",
      href: "/services?category=Photography%20%26%20Videography",
    },
    {
      label: "Wedding Venues",
      href: "/services?category=Wedding%20Venues",
    },
    {
      label: "Decoration & Florist",
      href: "/services?category=Decoration%20%26%20Florist",
    },
    {
      label: "Catering Services",
      href: "/services?category=Catering%20Services",
    },
    {
      label: "Makeup & Styling",
      href: "/services?category=Makeup%20%26%20Styling",
    },
    {
      label: "Wedding Fashion",
      href: "/services?category=Wedding%20Fashion",
    },
  ] satisfies FooterLinkItem[],
  contact: {
    email: "hello@wedplan.com",
    phone: "+880 1700-000000",
    address: "Gulshan-2, Dhaka 1212, Bangladesh",
    hours: "Sat – Thu, 9:00 AM – 8:00 PM",
  },
  socials: [
    {
      name: "Facebook",
      platform: "facebook",
      href: "https://facebook.com",
    },
    {
      name: "Instagram",
      platform: "instagram",
      href: "https://instagram.com",
    },
    {
      name: "YouTube",
      platform: "youtube",
      href: "https://youtube.com",
    },
    {
      name: "LinkedIn",
      platform: "linkedin",
      href: "https://linkedin.com",
    },
  ] satisfies FooterSocialItem[],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ] satisfies FooterLinkItem[],
} as const;
