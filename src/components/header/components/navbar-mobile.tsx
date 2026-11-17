"use client";

import {
  Briefcase,
  Calendar,
  Heart,
  LogOut,
  type LucideIcon,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { NavbarAction, NavIconName, NavItem } from "@/types/getUI_types";
import { getRoleMenu } from "./role-menu";

const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  heart: Heart,
  calendar: Calendar,
  briefcase: Briefcase,
  shield: Shield,
  users: Users,
};

interface NavbarMobileToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function NavbarMobileToggle({
  isOpen,
  onToggle,
  className,
}: NavbarMobileToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "lg:hidden w-9 h-9 rounded-full border border-border/80 flex items-center justify-center text-foreground/80 hover:text-foreground cursor-pointer transition-colors",
        className,
      )}
      aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
    </button>
  );
}

interface UserSessionInfo {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
}

interface NavbarMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  actions: NavbarAction[];
  user?: UserSessionInfo | null;
  className?: string;
}

export function NavbarMobileDrawer({
  isOpen,
  onClose,
  navItems,
  actions,
  user,
  className,
}: NavbarMobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      onClose();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const roleMenu = user ? getRoleMenu(user.role) : null;
  const roleMenuHrefs = new Set(roleMenu?.items.map((item) => item.href) || []);

  // Avoid duplicating links that already live in the role account section
  const visibleNavItems = user
    ? navItems.filter((item) => !roleMenuHrefs.has(item.href))
    : navItems;

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "U";

  return (
    <div
      className={cn(
        "lg:hidden mt-3 mx-auto max-w-7xl rounded-3xl bg-popover/98 backdrop-blur-xl border border-border shadow-2xl p-5 animate-in slide-in-from-top-2 duration-200",
        className,
      )}
    >
      {/* If logged in: User Header Profile Card */}
      {user ? (
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Avatar className="size-10 rounded-full border border-border">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="bg-primary-subtle text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          {roleMenu?.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary">
              {roleMenu.badge}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu Navigation
          </span>
        </div>
      )}

      {/* Nav Links */}
      <div className="mt-3 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon ? NAV_ICONS[item.icon] : null;
          return (
            <div key={item.name} className="space-y-1">
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary-subtle text-primary font-semibold"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4 text-foreground/80" />}
                  <span>{item.name}</span>
                </span>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>

              {item.dropdownItems && (
                <div className="pl-4 space-y-1 border-l-2 border-primary/30 ml-3">
                  {item.dropdownItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      onClick={onClose}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Role-Based Account Section (User / Vendor / Admin) */}
        {roleMenu && (
          <div className="pt-2 mt-2 border-t border-border/60 space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {roleMenu.sectionTitle}
            </div>

            {roleMenu.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold leading-none">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Action: Logout (if logged in) or Sign In/Sign Up (if logged out) */}
      {user ? (
        <div className="mt-5 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        actions &&
        actions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-border flex flex-col space-y-2.5">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={onClose}
                className={cn(
                  "text-center py-2.5 rounded-full text-sm font-medium transition-colors",
                  action.variant === "outline"
                    ? "border border-primary text-primary hover:bg-primary/10"
                    : "bg-primary hover:bg-primary-hover text-primary-foreground",
                )}
              >
                {action.label}
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
