"use server";

import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type { VendorServiceResult } from "../vendor-services.types";

export async function deleteVendorService(
  serviceId: string,
): Promise<VendorServiceResult<null>> {
  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(
      `${API_BASE_URL}/services/${encodeURIComponent(serviceId)}`,
      {
        method: "DELETE",
        headers: authHeaders,
        cache: "no-store",
      },
    );

    const payload = (await res.json()) as VendorServiceResult<null>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Could not delete service.",
      };
    }

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/vendor/services");
    revalidatePath("/vendor/dashboard");
    revalidatePath("/admin/services");

    return { success: true, message: payload.message };
  } catch (error) {
    console.error("deleteVendorService error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
