"use server";

import { revalidatePath } from "next/cache";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  CreateVendorServiceInput,
  VendorServiceRecord,
  VendorServiceResult,
} from "../vendor-services.types";

export async function createVendorService(
  input: CreateVendorServiceInput,
): Promise<VendorServiceResult<VendorServiceRecord>> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(`${baseUrl}/services`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(input),
      cache: "no-store",
    });

    const payload =
      (await res.json()) as VendorServiceResult<VendorServiceRecord>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Could not create service.",
      };
    }

    revalidatePath("/vendor/services");
    revalidatePath("/vendor/dashboard");
    revalidatePath("/admin");
    revalidatePath("/admin/services");

    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("createVendorService error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
