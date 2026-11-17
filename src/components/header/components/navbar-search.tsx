"use client";

import { Search, Sparkles, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarSearchProps {
  className?: string;
}

const POPULAR_SEARCHES = [
  { label: "Venues", query: "Wedding Venues" },
  { label: "Photography", query: "Photography & Videography" },
  { label: "Florist & Decor", query: "Decoration & Florist" },
  { label: "Catering", query: "Catering Services" },
  { label: "Bridal Wear", query: "Wedding Fashion" },
];

export function NavbarSearch({ className }: NavbarSearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const executeSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      setIsSearchOpen(false);
      window.location.href = `/services?search=${encodeURIComponent(trimmed)}`;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    executeSearch(query);
  };

  return (
    <div ref={searchContainerRef} className={cn("relative", className)}>
      {/* Search Toggle Button */}
      <button
        type="button"
        onClick={() => setIsSearchOpen((prev) => !prev)}
        className={cn(
          "w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer",
          isSearchOpen
            ? "bg-primary-subtle text-primary border-primary/50 shadow-xs"
            : "border-border/80 text-foreground/70 hover:text-foreground hover:border-foreground/40 hover:bg-muted/50",
        )}
        aria-label={
          isSearchOpen ? "Close search bar" : "Search wedding services"
        }
        aria-expanded={isSearchOpen}
      >
        {isSearchOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </button>

      {/* Floating Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-15 sm:mt-3 w-auto sm:w-140 rounded-3xl bg-popover/98 dark:bg-card/98 backdrop-blur-2xl border border-border shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Search Input Box */}
            <div className="relative flex items-center bg-muted/60 border border-border/80 rounded-2xl px-3 py-1.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="search"
                name="search"
                placeholder="Search venues, photographers, florists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-2.5 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                aria-label="Search query"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer mr-1"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>

            {/* Popular Searches Quick Tags */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleQuickSearch(item.query)}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted/50 hover:bg-primary-subtle hover:text-primary border border-border/60 hover:border-primary/30 transition-all cursor-pointer text-muted-foreground font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NavbarSearch;
