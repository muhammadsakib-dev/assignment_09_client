import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavbarAction } from "../navbar-data";

interface NavbarActionsProps {
  actions: NavbarAction[];
  className?: string;
}

export function NavbarActions({ actions, className }: NavbarActionsProps) {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className={cn("hidden lg:flex items-center space-x-2", className)}>
      {actions.map((action) => {
        if (action.variant === "outline") {
          return (
            <Link
              key={action.label}
              href={action.href}
              className="border border-primary text-primary hover:bg-primary/10 px-4.5 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              {action.label}
            </Link>
          );
        }

        return (
          <Link
            key={action.label}
            href={action.href}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-1.5 rounded-full text-sm font-medium transition-colors shadow-xs"
          >
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}

export default NavbarActions;
