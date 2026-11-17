"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface HeaderWrapperProps {
  children: ReactNode;
}

const AUTH_ROUTES = ["/login", "/sign-up", "/forgot-password"];

export function HeaderWrapper({ children }: HeaderWrapperProps) {
  const pathname = usePathname();

  const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  if (isAuthPage) {
    return null;
  }

  return <>{children}</>;
}

export default HeaderWrapper;
