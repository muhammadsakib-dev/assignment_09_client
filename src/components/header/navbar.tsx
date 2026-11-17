"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { NavbarConfig, NavItem } from "@/types/getUI_types";
import {
  NavbarActions,
  NavbarBrand,
  NavbarMobileDrawer,
  NavbarMobileToggle,
  NavbarNav,
  NavbarSearch,
  NavbarUser,
} from "./components";

interface NavbarProps {
  navbar: NavbarConfig;
}

export function Navbar({ navbar }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user || null;

  const {
    brand,
    navItems,
    navItemsLoggedIn,
    navItemsUser,
    navItemsVendor,
    navItemsAdmin,
    actions,
  } = navbar;

  // Map each authenticated role to its navigation list
  const roleNavMap: Record<string, NavItem[] | undefined> = {
    user: navItemsUser || navItemsLoggedIn,
    vendor: navItemsVendor,
    admin: navItemsAdmin,
  };

  const currentNavItems: NavItem[] = user
    ? roleNavMap[user.role || "user"] || navItemsUser || navItems
    : navItems;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3 transition-all">
      {/* Floating Pill Container */}
      <div className="mx-auto max-w-7xl rounded-full bg-card/95 backdrop-blur-md border border-border/70 shadow-sm px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Mobile / Tablet Left: Hamburger Menu Toggle Button */}
        <div className="flex items-center lg:hidden w-9">
          <NavbarMobileToggle
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen((prev) => !prev)}
          />
        </div>

        {/* Brand / Logo: Centered on Mobile/Tablet, Left-aligned on Desktop */}
        <div className="flex-1 flex justify-center lg:flex-none lg:justify-start">
          <NavbarBrand logoUrl={brand.logoUrl} />
        </div>

        {/* Center Desktop Navigation (Hidden on Mobile/Tablet) */}
        <NavbarNav navItems={currentNavItems} />

        {/* Right Section: Search & Actions / User Profile */}
        <div className="flex items-center justify-end space-x-2.5 w-9 lg:w-auto">
          {/* Circular Search Button (Replaces Notification Button per user instruction) */}
          <NavbarSearch />

          {user ? (
            <div className="hidden lg:flex items-center">
              {/* Divider between Search and User Profile */}
              <div className="h-5 w-px bg-border/80 mx-2" />

              {/* User Avatar, Name & Dropdown Menu */}
              <NavbarUser user={user} />
            </div>
          ) : (
            /* Guest Actions: Sign In (outline) & Sign Up (solid) */
            <NavbarActions actions={actions} />
          )}
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      <NavbarMobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={currentNavItems}
        actions={actions}
        user={user}
      />
    </header>
  );
}

export default Navbar;
