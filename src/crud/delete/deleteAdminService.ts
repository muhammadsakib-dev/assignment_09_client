"use server";

import { revalidatePath } from "next/cache";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type { AdminServiceResult } from "../admin.types";

export async function deleteAdminService(
  serviceId: string,
): Promise<AdminServiceResult<null>> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(
      `${baseUrl}/admin/services/${encodeURIComponent(serviceId)}`,
      {
        method: "DELETE",
        headers: authHeaders,
        cache: "no-store",
      },
    );
    const payload = (await res.json()) as AdminServiceResult<null>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to delete service.",
      };
    }

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin");
    revalidatePath("/admin/services");
    revalidatePath("/vendor/services");

    return { success: true, message: payload.message };
  } catch (error) {
    console.error("deleteAdminService error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
