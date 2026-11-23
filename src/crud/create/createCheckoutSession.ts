"use server";

import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  BillingCycle,
  CheckoutServiceResult,
  CheckoutSessionData,
} from "../checkout.types";

export async function createCheckoutSession(
  billingCycle: BillingCycle = "monthly",
): Promise<CheckoutServiceResult<CheckoutSessionData>> {
  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(`${API_BASE_URL}/checkout/create-session`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ billingCycle }),
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
