"use server";

import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  VendorServiceRecord,
  VendorServiceResult,
} from "../vendor-services.types";

export async function getVendorServices(): Promise<
  VendorServiceResult<VendorServiceRecord[]>
> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return {
      success: false,
      message: "Backend API URL is not configured.",
      data: [],
    };
  }

  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(`${baseUrl}/services/mine`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const payload = (await res.json()) as VendorServiceResult<
      VendorServiceRecord[]
    >;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load your services.",
        data: [],
      };
    }

    return {
      success: true,
      message: payload.message,
      data: payload.data ?? [],
    };
  } catch (error) {
    console.error("getVendorServices error:", error);
    return {
      success: false,
      message: "Unable to connect to backend server.",
      data: [],
    };
  }
}
