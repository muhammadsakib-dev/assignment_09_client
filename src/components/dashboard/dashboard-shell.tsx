import type { ReactNode } from "react";
import { DashboardSidebar } from "./01-sidebar/dashboard-sidebar";

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: "user" | "customer" | "vendor" | "admin";
  };
  title: string;
  description?: string;
  badge?: string;
  children: ReactNode;
}

export function DashboardShell({
  user,
  title,
  description,
  badge,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <DashboardSidebar user={user} />

      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          <header className="space-y-2 pb-6 border-b border-border/70">
            {badge && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
                {badge}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
