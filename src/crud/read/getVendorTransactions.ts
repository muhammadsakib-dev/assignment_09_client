"use server";

import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  CheckoutServiceResult,
  VendorTransactionRecord,
} from "../checkout.types";

export async function getVendorTransactions(): Promise<
  CheckoutServiceResult<VendorTransactionRecord[]>
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
    const res = await fetch(`${baseUrl}/checkout/transactions`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const payload = (await res.json()) as CheckoutServiceResult<
      VendorTransactionRecord[]
    >;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load billing history.",
        data: [],
      };
    }

    return {
      success: true,
      message: payload.message || "Billing history loaded.",
      data: payload.data ?? [],
    };
  } catch (error) {
    console.error("getVendorTransactions error:", error);
    return {
      success: false,
      message: "Unable to connect to the payment server.",
      data: [],
    };
  }
}
