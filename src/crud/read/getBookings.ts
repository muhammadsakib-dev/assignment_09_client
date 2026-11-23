"use server";

import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  BookingRecord,
  BookingServiceResult,
  BookingStatus,
} from "../bookings.types";

export async function getBookings(
  status?: BookingStatus,
): Promise<BookingServiceResult<BookingRecord[]>> {
  try {
    const authHeaders = await getAuthFetchHeaders();
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`${API_BASE_URL}/bookings${query}`, {
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
