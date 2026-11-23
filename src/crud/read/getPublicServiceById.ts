"use server";

import { API_BASE_URL } from "@/config/env";
import type { VendorServiceRecord } from "../vendor-services.types";

export interface SingleServiceResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data: VendorServiceRecord | null;
}

export async function getPublicServiceById(
  id: string,
): Promise<SingleServiceResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/services/${encodeURIComponent(id)}`, {
      method: "GET",
      cache: "no-store",
    });

    const payload = (await res.json()) as {
      success?: boolean;
      message?: string;
      data?: VendorServiceRecord;
    };

    if (!res.ok || !payload.success || !payload.data) {
      return {
        success: false,
        statusCode: res.status,
        message: payload.message || "Service not found.",
        data: null,
      };
    }

    return {
      success: true,
      statusCode: 200,
      data: payload.data,
    };
  } catch (error) {
    console.error("getPublicServiceById error:", error);
    return {
      success: false,
      statusCode: 503,
      message: "Unable to connect to the backend server.",
      data: null,
    };
  }
}
