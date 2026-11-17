import {
  Briefcase,
  Calendar,
  Heart,
  LayoutGrid,
  type LucideIcon,
  Shield,
  User,
  Users,
} from "lucide-react";

export type UserRole = "user" | "vendor" | "admin";

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

const ROLE_MENUS: Record<UserRole, RoleMenuConfig> = {
  user: {
    badge: null,
    sectionTitle: "My Account",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "Profile Settings", href: "/profile", icon: User },
      { label: "My Bookings", href: "/bookings", icon: Calendar },
      { label: "Saved Services", href: "/saved", icon: Heart, badge: "3" },
    ],
  },
  vendor: {
    badge: "Vendor",
    sectionTitle: "Vendor Portal",
    items: [
      {
        label: "Vendor Dashboard",
        href: "/vendor/dashboard",
        icon: LayoutGrid,
      },
      { label: "Profile Settings", href: "/profile", icon: User },
      { label: "My Services", href: "/vendor/services", icon: Briefcase },
      { label: "Booking Requests", href: "/vendor/bookings", icon: Calendar },
    ],
  },
  admin: {
    badge: "Admin",
    sectionTitle: "Admin Controls",
    items: [
      { label: "Admin Dashboard", href: "/admin", icon: Shield },
      { label: "Manage Users", href: "/admin/users", icon: Users },
      { label: "Profile Settings", href: "/profile", icon: User },
    ],
  },
};

export function getRoleMenu(role?: string | null): RoleMenuConfig {
  if (role === "admin") return ROLE_MENUS.admin;
  if (role === "vendor") return ROLE_MENUS.vendor;
  return ROLE_MENUS.user;
}
