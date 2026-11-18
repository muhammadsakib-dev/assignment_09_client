"use client";

import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getRoleMenu } from "./role-menu";

interface NavbarUserProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
  className?: string;
}

export function NavbarUser({ user, className }: NavbarUserProps) {
  const router = useRouter();
  const roleMenu = getRoleMenu(user.role);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Derive initials for avatar fallback (e.g. "MD. Sakib" -> "MS")
  const initials = user.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "U";

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-muted/60 transition-colors outline-hidden cursor-pointer group data-popup-open:bg-muted/60"
          aria-label="User account menu"
        >
          <Avatar className="size-8 rounded-full border border-border shadow-xs">
            {user.image && (
              <AvatarImage src={user.image} alt={user.name || "User avatar"} />
            )}
            <AvatarFallback className="bg-primary-subtle text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="hidden sm:inline-block text-sm font-semibold text-foreground max-w-[130px] truncate">
            {user.name}
          </span>

          {roleMenu.badge && (
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-primary-subtle text-primary text-[10px] font-bold uppercase tracking-wider">
              {roleMenu.badge}
            </span>
          )}

          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 p-2 rounded-2xl bg-popover/98 backdrop-blur-xl border border-border shadow-xl animate-in fade-in-0 zoom-in-95 z-50"
        >
          {/* User Preview Header */}
          <div className="px-3 py-2 border-b border-border/80 mb-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {user.name}
              </p>
              {roleMenu.badge && (
                <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                  {roleMenu.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          {/* Role-Specific Menu Items */}
          {roleMenu.items.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} />}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-tight">
                    {item.badge}
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-1.5" />

          {/* Logout Action */}
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary-subtle cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0 text-primary" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default NavbarUser;
