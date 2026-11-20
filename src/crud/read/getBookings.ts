"use server";

import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  BookingRecord,
  BookingServiceResult,
  BookingStatus,
} from "../bookings.types";

export async function getBookings(
  status?: BookingStatus,
): Promise<BookingServiceResult<BookingRecord[]>> {
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
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`${baseUrl}/bookings${query}`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const payload = (await res.json()) as BookingServiceResult<BookingRecord[]>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load bookings.",
        data: [],
      };
    }

    return {
      success: true,
      message: payload.message,
      data: payload.data ?? [],
    };
  } catch (error) {
    console.error("getBookings error:", error);
    return {
      success: false,
      message:
        "Unable to connect to the booking server. Please ensure the backend is running.",
      data: [],
    };
  }
}
