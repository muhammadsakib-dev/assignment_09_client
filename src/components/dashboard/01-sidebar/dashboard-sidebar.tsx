"use client";

import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CreditCard,
  Crown,
  Heart,
  LayoutGrid,
  LogOut,
  type LucideIcon,
  Menu,
  PlusCircle,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const CUSTOMER_SIDEBAR_LINKS: SidebarLink[] = [
  { label: "Customer Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "My Bookings", href: "/bookings", icon: Calendar },
  { label: "Saved Services", href: "/saved", icon: Heart },
  { label: "Profile Settings", href: "/profile", icon: User },
];

const ROLE_SIDEBAR_LINKS: Record<
  "user" | "customer" | "vendor" | "admin",
  SidebarLink[]
> = {
  user: CUSTOMER_SIDEBAR_LINKS,
  customer: CUSTOMER_SIDEBAR_LINKS,
  vendor: [
    { label: "Vendor Overview", href: "/vendor/dashboard", icon: LayoutGrid },
    { label: "My Services", href: "/vendor/services", icon: Briefcase },
    { label: "Add Service", href: "/vendor/add-service", icon: PlusCircle },
    { label: "Booking Requests", href: "/vendor/bookings", icon: Calendar },
    { label: "Subscription Plans", href: "/vendor/subscription", icon: Crown },
    { label: "Profile Settings", href: "/profile", icon: User },
  ],
  admin: [
    { label: "Platform Overview", href: "/admin", icon: Shield },
    { label: "Manage Users", href: "/admin/users", icon: Users },
    { label: "Manage Services", href: "/admin/services", icon: Briefcase },
    {
      label: "Platform Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
    },
    { label: "Profile Settings", href: "/profile", icon: User },
  ],
};

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: "user" | "customer" | "vendor" | "admin";
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = ROLE_SIDEBAR_LINKS[user.role];

  const initials = user.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "U";

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const roleLabel =
    user.role === "vendor"
      ? "Vendor Portal"
      : user.role === "admin"
        ? "Admin Panel"
        : "Couple Workspace";

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-5">
      <div className="space-y-6">
        {/* Brand & Role Pill */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-border/70">
          <Link
            href="/"
            className="inline-flex items-center hover:opacity-90 transition-opacity dark:bg-foreground/95 dark:px-2.5 dark:py-0.5 dark:rounded-2xl"
            aria-label="WedPlan Home"
          >
            <Image
              src="https://ik.imagekit.io/muhammadsakib/Assignment_09/WedPlan%20Logo.png"
              alt="WedPlan Logo"
              width={120}
              height={34}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <span className="px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-[10px] font-bold uppercase tracking-wider shrink-0">
            {user.role}
          </span>
        </div>

        {/* User Profile Preview */}
        <div className="flex items-center gap-3 rounded-2xl bg-muted/50 border border-border/70 p-3">
          <Avatar className="size-10 rounded-full border border-border shrink-0">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="bg-primary-subtle text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav aria-label={roleLabel} className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {roleLabel}
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/70",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-border/70 space-y-2.5">
        <div className="space-y-1.5">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Appearance
          </p>
          <ThemeToggle variant="segmented" />
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Website</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-primary hover:bg-primary-subtle transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted cursor-pointer"
          >
            {isMobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
          <span className="text-sm font-bold text-foreground">{roleLabel}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle variant="icon" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[82vw] bg-card border-r border-border shadow-2xl h-full overflow-y-auto">
            {sidebarContent}
          </div>
          <button
            type="button"
            aria-label="Close navigation backdrop"
            onClick={() => setIsMobileOpen(false)}
            className="flex-1 bg-black/40 backdrop-blur-2xs cursor-pointer"
          />
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-border/80 bg-card/70 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
}
