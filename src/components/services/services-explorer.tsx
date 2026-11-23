"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { VendorServiceRecord } from "@/crud/vendor-services.types";
import { cn } from "@/lib/utils";
import { ServiceCard } from "./03-card/service-card";
import { SERVICE_CATEGORIES, SERVICE_LOCATIONS } from "./services-data";

type SortOption = "featured" | "price-asc" | "price-desc";

const ALL_CATEGORY = "All Categories";
const SERVICES_PER_PAGE = 6;

interface ServicesExplorerProps {
  initialServices: VendorServiceRecord[];
  savedServiceIds?: string[];
  errorMessage?: string;
}

export function ServicesExplorer({
  initialServices,
  savedServiceIds = [],
  errorMessage,
}: ServicesExplorerProps) {
  const savedSet = useMemo(() => new Set(savedServiceIds), [savedServiceIds]);
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || ALL_CATEGORY;
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "All Locations";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || ALL_CATEGORY);
    setSearchQuery(searchParams.get("search") || "");
    setSelectedLocation(searchParams.get("location") || "All Locations");
    setCurrentPage(1);
  }, [searchParams]);

  // Reset to page 1 whenever search, category, location or sort filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLocation, sortBy]);

  // Combine default locations with any custom city entered by real vendors in MongoDB
  const locationOptions = useMemo(() => {
    const set = new Set<string>(SERVICE_LOCATIONS);
    for (const s of initialServices) {
      if (s.location?.trim()) {
        set.add(s.location.trim());
      }
    }
    return Array.from(set);
  }, [initialServices]);

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = initialServices.filter((service) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORY ||
        service.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "All Locations" ||
        service.location.toLowerCase() === selectedLocation.toLowerCase();

      const matchesQuery =
        !query ||
        service.serviceName.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.location.toLowerCase().includes(query) ||
        service.vendorName.toLowerCase().includes(query);

      return matchesCategory && matchesLocation && matchesQuery;
    });

    const sorted = [...matched];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [
    initialServices,
    searchQuery,
    selectedCategory,
    selectedLocation,
    sortBy,
  ]);

  const totalServices = filteredServices.length;
  const totalPages = Math.max(1, Math.ceil(totalServices / SERVICES_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedServices = useMemo(() => {
    const start = (safePage - 1) * SERVICES_PER_PAGE;
    return filteredServices.slice(start, start + SERVICES_PER_PAGE);
  }, [filteredServices, safePage]);

  const startItem =
    totalServices === 0 ? 0 : (safePage - 1) * SERVICES_PER_PAGE + 1;
  const endItem = Math.min(safePage * SERVICES_PER_PAGE, totalServices);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    setCurrentPage(page);
    const anchor = document.getElementById("services-catalog-top");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (safePage > 3) {
      pages.push("...");
    }
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) {
      pages.push("...");
    }
    pages.push(totalPages);
    return pages;
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== ALL_CATEGORY ||
    selectedLocation !== "All Locations" ||
    sortBy !== "featured";

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORY);
    setSelectedLocation("All Locations");
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-8">
        {errorMessage && (
          <div className="rounded-3xl border border-destructive/25 bg-destructive/5 p-5 flex items-start gap-3 text-sm text-destructive">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to Reach Services API</p>
              <p className="text-xs opacity-90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Search, Location & Price Sort Controls */}
        <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative flex items-center bg-muted/50 border border-border/80 rounded-2xl px-3.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, venues, or vendor name..."
                aria-label="Search services by name"
                className="w-full bg-transparent px-2.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div className="md:col-span-3 relative flex items-center bg-muted/50 border border-border/80 rounded-2xl px-3.5 focus-within:border-primary/60">
              <MapPin className="w-4 h-4 text-primary/80 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by location"
                className="w-full bg-transparent px-2 py-2.5 text-sm font-medium text-foreground focus:outline-hidden cursor-pointer"
              >
                {locationOptions.map((loc) => (
                  <option
                    key={loc}
                    value={loc}
                    className="bg-popover text-foreground"
                  >
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3 relative flex items-center bg-muted/50 border border-border/80 rounded-2xl px-3.5 focus-within:border-primary/60">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort wedding services"
                className="w-full bg-transparent px-2 py-2.5 text-sm font-medium text-foreground focus:outline-hidden cursor-pointer"
              >
                <option value="featured" className="bg-popover text-foreground">
                  Sort: Featured
                </option>
                <option
                  value="price-asc"
                  className="bg-popover text-foreground"
                >
                  Price: Low to High
                </option>
                <option
                  value="price-desc"
                  className="bg-popover text-foreground"
                >
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[ALL_CATEGORY, ...SERVICE_CATEGORIES.map((c) => c.name)].map(
              (category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground/30",
                    )}
                  >
                    {category}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Result Summary Bar */}
        <div
          id="services-catalog-top"
          className="flex flex-wrap items-center justify-between gap-3 scroll-mt-24"
        >
          <p className="text-sm text-muted-foreground">
            {totalServices > 0 ? (
              <>
                Showing{" "}
                <strong className="font-semibold text-foreground">
                  {startItem}–{endItem}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-foreground">
                  {totalServices}
                </strong>{" "}
                {totalServices === 1 ? "service" : "services"}
              </>
            ) : (
              <>
                Showing{" "}
                <strong className="font-semibold text-foreground">0</strong>{" "}
                services
              </>
            )}
            {selectedCategory !== ALL_CATEGORY && (
              <>
                {" "}
                in{" "}
                <span className="font-medium text-primary">
                  {selectedCategory}
                </span>
              </>
            )}
            {totalPages > 1 && (
              <span className="ml-2 text-xs opacity-75 font-medium">
                (Page {safePage} of {totalPages})
              </span>
            )}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Listing Grid or Empty State */}
        {totalServices > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.25),
                  }}
                >
                  <ServiceCard
                    service={service}
                    initialSaved={savedSet.has(service.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground order-2 sm:order-1">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {startItem}–{endItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalServices}
                  </span>{" "}
                  services (Page {safePage} of {totalPages})
                </p>

                <nav
                  role="navigation"
                  aria-label="Services pagination"
                  className="flex items-center gap-1.5 order-1 sm:order-2"
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(safePage - 1)}
                    disabled={safePage === 1}
                    aria-label="Go to previous page"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((item, idx) => {
                      if (item === "...") {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 py-1 text-xs text-muted-foreground select-none"
                          >
                            …
                          </span>
                        );
                      }
                      const isCurrent = item === safePage;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handlePageChange(item)}
                          aria-current={isCurrent ? "page" : undefined}
                          aria-label={`Page ${item}`}
                          className={cn(
                            "size-9 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center border",
                            isCurrent
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                              : "bg-card text-foreground border-border hover:bg-muted hover:border-foreground/20",
                          )}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(safePage + 1)}
                    disabled={safePage === totalPages}
                    aria-label="Go to next page"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card/70 p-12 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-foreground">
                No Wedding Services Found
              </h2>
              <p className="text-sm text-muted-foreground">
                {initialServices.length === 0
                  ? "No approved wedding services are currently listed yet."
                  : "We couldn't find any active services matching your search criteria. Try adjusting your location, category, or keywords."}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
