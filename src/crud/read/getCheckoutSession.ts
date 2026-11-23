"use server";

import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  CheckoutServiceResult,
  CheckoutVerificationData,
} from "../checkout.types";

export async function getCheckoutSession(
  sessionId: string,
): Promise<CheckoutServiceResult<CheckoutVerificationData>> {
  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(`${API_BASE_URL}/checkout/session/${sessionId}`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const payload =
      (await res.json()) as CheckoutServiceResult<CheckoutVerificationData>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to retrieve payment confirmation.",
      };
    }

    return {
      success: true,
      message: payload.message || "Payment verified.",
      data: payload.data,
    };
  } catch (error) {
    console.error("getCheckoutSession error:", error);
    return {
      success: false,
      message:
        "Unable to verify payment status with server. Please refresh or check dashboard.",
    };
  }
}
