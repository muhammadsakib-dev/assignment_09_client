export type ServiceCategory =
  | "Photography & Videography"
  | "Wedding Venues"
  | "Decoration & Florist"
  | "Catering Services"
  | "Makeup & Styling"
  | "Wedding Fashion";

export type CategoryIconName =
  | "camera"
  | "venue"
  | "florist"
  | "catering"
  | "makeup"
  | "fashion";

export interface ServiceCategoryMeta {
  name: ServiceCategory;
  shortLabel: string;
  description: string;
  icon: CategoryIconName;
}

export const SERVICE_CATEGORIES: ServiceCategoryMeta[] = [
  {
    name: "Photography & Videography",
    shortLabel: "Photography",
    description: "Editorial wedding stills, 4K cinema & drone reels",
    icon: "camera",
  },
  {
    name: "Wedding Venues",
    shortLabel: "Venues",
    description: "Grand ballrooms, garden courtyards & lakeside estates",
    icon: "venue",
  },
  {
    name: "Decoration & Florist",
    shortLabel: "Florist & Decor",
    description: "Bespoke floral mandaps, lighting & stage styling",
    icon: "florist",
  },
  {
    name: "Catering Services",
    shortLabel: "Catering",
    description: "Traditional royal feasts, live stations & plated dining",
    icon: "catering",
  },
  {
    name: "Makeup & Styling",
    shortLabel: "Makeup",
    description: "HD bridal glam, saree draping & hair artistry",
    icon: "makeup",
  },
  {
    name: "Wedding Fashion",
    shortLabel: "Fashion",
    description: "Designer lehengas, couture sarees & bespoke sherwanis",
    icon: "fashion",
  },
];

export const SERVICE_LOCATIONS = [
  "All Locations",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Cox's Bazar",
  "Rajshahi",
] as const;
