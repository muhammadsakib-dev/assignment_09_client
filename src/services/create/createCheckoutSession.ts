"use server";

import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  CheckoutServiceResult,
  CheckoutSessionData,
} from "../checkout.types";

export async function createCheckoutSession(): Promise<
  CheckoutServiceResult<CheckoutSessionData>
> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(`${baseUrl}/checkout/create-session`, {
      method: "POST",
      headers: authHeaders,
      cache: "no-store",
    });

    const payload =
      (await res.json()) as CheckoutServiceResult<CheckoutSessionData>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to initialize Stripe checkout.",
      };
    }

    return {
      success: true,
      message: payload.message || "Checkout session created.",
      data: payload.data,
    };
  } catch (error) {
    console.error("createCheckoutSession error:", error);
    return {
      success: false,
      message:
        "Unable to connect to the payment server. Please verify backend service.",
    };
  }
}
