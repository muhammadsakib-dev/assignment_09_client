"use server";

import { revalidatePath } from "next/cache";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  BookingRecord,
  BookingServiceResult,
  CreateBookingInput,
} from "../bookings.types";

export async function createBooking(
  input: CreateBookingInput,
): Promise<BookingServiceResult<BookingRecord>> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(`${baseUrl}/bookings`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(input),
      cache: "no-store",
    });

    const payload = (await res.json()) as BookingServiceResult<BookingRecord>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to submit booking request.",
      };
    }

    revalidatePath("/bookings");
    revalidatePath("/dashboard");
    revalidatePath("/vendor/bookings");
    revalidatePath("/vendor/dashboard");

    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("createBooking error:", error);
    return {
      success: false,
      message:
        "Unable to connect to the booking server. Please ensure the backend is running.",
    };
  }
}
