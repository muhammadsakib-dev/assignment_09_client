"use server";

import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  BookingAction,
  BookingRecord,
  BookingServiceResult,
} from "../bookings.types";

export async function updateBookingStatus(
  bookingId: string,
  action: BookingAction,
): Promise<BookingServiceResult<BookingRecord>> {
  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(
      `${API_BASE_URL}/bookings/${encodeURIComponent(bookingId)}/status`,
      {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ action }),
        cache: "no-store",
      },
    );

    const payload = (await res.json()) as BookingServiceResult<BookingRecord>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to update booking status.",
      };
    }

    revalidatePath("/bookings");
    revalidatePath("/dashboard");
    revalidatePath("/vendor/bookings");
    revalidatePath("/vendor/dashboard");

    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    return {
      success: false,
      message:
        "Unable to connect to the booking server. Please ensure the backend is running.",
    };
  }
}
