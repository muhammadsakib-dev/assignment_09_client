"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

interface ThemeToggleProps {
  variant?: "icon" | "segmented";
  className?: string;
}

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (variant === "segmented") {
    return (
      <fieldset
        aria-label="Color theme"
        className={cn(
          "grid grid-cols-3 gap-1 rounded-2xl border border-border/80 bg-muted/60 p-1",
          className,
        )}
      >
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = mounted && theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </fieldset>
    );
  }

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle color theme"
      }
      title={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      className={cn(
        "w-9 h-9 rounded-full border border-border/80 bg-background/60 hover:bg-muted flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors cursor-pointer shrink-0",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="w-4 h-4 text-champagne transition-transform duration-200 hover:rotate-12" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12" />
        )
      ) : (
        <span className="w-4 h-4 rounded-full bg-muted/70" />
      )}
    </button>
  );
}
