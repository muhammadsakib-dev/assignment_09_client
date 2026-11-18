"use server";

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
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return {
      success: false,
      statusCode: 500,
      message: "Backend API URL is not configured.",
      data: null,
    };
  }

  try {
    const res = await fetch(`${baseUrl}/services/${encodeURIComponent(id)}`, {
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
