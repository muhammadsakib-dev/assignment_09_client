import {
  Briefcase,
  Calendar,
  CreditCard,
  Crown,
  Heart,
  LayoutGrid,
  type LucideIcon,
  PlusCircle,
  Shield,
  User,
  Users,
} from "lucide-react";
import type { NavIconName } from "../navbar-data";

export const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  heart: Heart,
  calendar: Calendar,
  briefcase: Briefcase,
  crown: Crown,
  shield: Shield,
  users: Users,
};

export type UserRole = "user" | "customer" | "vendor" | "admin";

export interface RoleMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface RoleMenuConfig {
  badge: string | null;
  sectionTitle: string;
  items: RoleMenuItem[];
}

const CUSTOMER_MENU: RoleMenuConfig = {
  badge: null,
  sectionTitle: "Customer Portal",
  items: [
    { label: "Customer Dashboard", href: "/dashboard", icon: LayoutGrid },
    { label: "My Bookings", href: "/bookings", icon: Calendar },
    { label: "Saved Services", href: "/saved", icon: Heart },
    { label: "Profile Settings", href: "/profile", icon: User },
  ],
};

const ROLE_MENUS: Record<UserRole, RoleMenuConfig> = {
  user: CUSTOMER_MENU,
  customer: CUSTOMER_MENU,
  vendor: {
    badge: "Vendor",
    sectionTitle: "Vendor Portal",
    items: [
      {
        label: "Vendor Dashboard",
        href: "/vendor/dashboard",
        icon: LayoutGrid,
      },
      { label: "My Services", href: "/vendor/services", icon: Briefcase },
      { label: "Add Service", href: "/vendor/add-service", icon: PlusCircle },
      { label: "Booking Requests", href: "/vendor/bookings", icon: Calendar },
      {
        label: "Subscription Plans",
        href: "/vendor/subscription",
        icon: Crown,
      },
      { label: "Profile Settings", href: "/profile", icon: User },
    ],
  },
  admin: {
    badge: "Admin",
    sectionTitle: "Admin Panel",
    items: [
      { label: "Admin Dashboard", href: "/admin", icon: Shield },
      { label: "Manage Users", href: "/admin/users", icon: Users },
      { label: "Manage Services", href: "/admin/services", icon: Briefcase },
      {
        label: "Platform Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
      },
      { label: "Profile Settings", href: "/profile", icon: User },
    ],
  },
};

export function getRoleMenu(role?: string | null): RoleMenuConfig {
  if (role === "admin") return ROLE_MENUS.admin;
  if (role === "vendor") return ROLE_MENUS.vendor;
  return ROLE_MENUS.user;
}
