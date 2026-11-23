"use server";

import { API_BASE_URL } from "@/config/env";
import type { VendorServiceRecord } from "../vendor-services.types";

export interface PublicServicesResponse {
  success: boolean;
  message?: string;
  services: VendorServiceRecord[];
  categoryCounts: Record<string, number>;
}

export async function getPublicServices(options?: {
  category?: string;
  location?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
}): Promise<PublicServicesResponse> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.set("category", options.category);
    if (options?.location) params.set("location", options.location);
    if (options?.search) params.set("search", options.search);
    if (options?.sort) params.set("sort", options.sort);
    if (options?.limit) params.set("limit", String(options.limit));

    const query = params.toString();
    const res = await fetch(`${API_BASE_URL}/services${query ? `?${query}` : ""}`, {
      method: "GET",
      cache: "no-store",
    });

    const payload = (await res.json()) as {
      success?: boolean;
      message?: string;
      data?: VendorServiceRecord[];
      meta?: { categoryCounts?: Record<string, number> };
    };

    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load wedding services.",
        services: [],
        categoryCounts: {},
      };
    }

    return {
      success: true,
      services: payload.data ?? [],
      categoryCounts: payload.meta?.categoryCounts ?? {},
    };
  } catch (error) {
    console.error("getPublicServices error:", error);
    return {
      success: false,
      message:
        "Unable to connect to the backend server. Please ensure Express is running.",
      services: [],
      categoryCounts: {},
    };
  }
}
