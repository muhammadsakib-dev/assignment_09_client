"use client";

import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { HERO_DATA } from "../hero-data";

export function HeroSearch() {
  const router = useRouter();
  const [category, setCategory] = useState<string>(HERO_DATA.categories[0]);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (category && category !== "All Categories") {
      params.set("category", category);
    }
    if (query.trim()) {
      params.set("search", query.trim());
    }

    const searchString = params.toString();
    router.push(searchString ? `/services?${searchString}` : "/services");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-2xl sm:rounded-full bg-card/95 backdrop-blur-md border border-border shadow-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition-all"
    >
      {/* Category Selector */}
      <div className="relative flex items-center sm:w-48 shrink-0">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Select wedding service category"
          className="w-full appearance-none bg-transparent pl-3.5 pr-8 py-2 text-sm font-medium text-foreground focus:outline-hidden cursor-pointer truncate"
        >
          {HERO_DATA.categories.map((cat) => (
            <option
              key={cat}
              value={cat}
              className="bg-popover text-foreground"
            >
              {cat}
            </option>
          ))}
        </select>
        <ChevronDown
          className="w-4 h-4 text-muted-foreground pointer-events-none absolute right-2.5"
          aria-hidden="true"
        />
      </div>

      {/* Subtle Divider on Desktop */}
      <div
        className="hidden sm:block h-6 w-px bg-border shrink-0"
        aria-hidden="true"
      />

      {/* Keyword / Location Input */}
      <div className="flex-1 flex items-center gap-2 px-3 sm:px-2">
        <Search
          className="w-4 h-4 text-muted-foreground shrink-0"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues, photographers, city..."
          aria-label="Search wedding services or location"
          className="w-full bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl sm:rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
      >
        Search
      </button>
    </form>
  );
}
