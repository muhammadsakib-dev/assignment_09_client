"use client";

import {
  Briefcase,
  Calendar,
  Heart,
  type LucideIcon,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { NavIconName, NavItem } from "@/types/getUI_types";

const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  heart: Heart,
  calendar: Calendar,
  briefcase: Briefcase,
  shield: Shield,
  users: Users,
};

interface NavbarNavProps {
  navItems: NavItem[];
}

export function NavbarNav({ navItems }: NavbarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {navItems.map((item: NavItem) => {
            const isActive = pathname === item.href;
            const Icon = item.icon ? NAV_ICONS[item.icon] : null;

            if (item.isDropdown && item.dropdownItems) {
              return (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger
                    className={cn(
                      "px-3.5 py-1.5 h-auto rounded-full text-sm font-medium transition-colors bg-transparent hover:bg-muted/60 focus:bg-muted/60 data-popup-open:bg-muted/60",
                      isActive
                        ? "bg-primary-subtle text-primary font-semibold"
                        : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-3 w-80 rounded-2xl bg-popover/98 backdrop-blur-xl border border-border shadow-xl">
                    <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </div>
                    <ul className="space-y-1 mt-1">
                      {item.dropdownItems.map((dropdownItem) => (
                        <li key={dropdownItem.name}>
                          <NavigationMenuLink
                            render={<Link href={dropdownItem.href} />}
                            className="flex flex-col items-start px-3 py-2 rounded-xl text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <span className="font-medium text-foreground">
                              {dropdownItem.name}
                            </span>
                            {dropdownItem.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {dropdownItem.description}
                              </span>
                            )}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            return (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink
                  render={<Link href={item.href} />}
                  className={cn(
                    "px-4 py-1.5 h-auto rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5",
                    isActive
                      ? "bg-primary-subtle text-primary font-semibold"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {Icon && (
                    <Icon className="w-4 h-4 shrink-0 text-foreground/80" />
                  )}

                  <span>{item.name}</span>

                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-tight">
                      {item.badge}
                    </span>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default NavbarNav;
