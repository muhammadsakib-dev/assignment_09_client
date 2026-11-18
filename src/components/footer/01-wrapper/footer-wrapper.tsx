"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface FooterWrapperProps {
  children: ReactNode;
}

const HIDDEN_CHROME_PREFIXES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/dashboard",
  "/vendor",
  "/admin",
  "/bookings",
  "/saved",
  "/profile",
];

export function FooterWrapper({ children }: FooterWrapperProps) {
  const pathname = usePathname();
  const shouldHide = HIDDEN_CHROME_PREFIXES.some((route) =>
    pathname?.startsWith(route),
  );

  if (shouldHide) {
    return null;
  }

  return <>{children}</>;
}

export default FooterWrapper;
