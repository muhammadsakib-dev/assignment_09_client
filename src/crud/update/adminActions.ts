"use server";

import { revalidatePath } from "next/cache";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type { AdminServiceResult } from "../admin.types";
import type {
  VendorServiceRecord,
  VendorServiceStatus,
} from "../vendor-services.types";

export async function updateAdminServiceStatus(
  serviceId: string,
  status: VendorServiceStatus,
): Promise<AdminServiceResult<VendorServiceRecord>> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(
      `${baseUrl}/admin/services/${encodeURIComponent(serviceId)}/status`,
      {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status }),
        cache: "no-store",
      },
    );
    const payload =
      (await res.json()) as AdminServiceResult<VendorServiceRecord>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to update service status.",
      };
    }

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/admin");
    revalidatePath("/admin/services");
    revalidatePath("/vendor/services");
    revalidatePath("/vendor/dashboard");

    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("updateAdminServiceStatus error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}

export async function toggleAdminUserBlock(
  userId: string,
  isBlocked: boolean,
): Promise<AdminServiceResult<{ id: string; isBlocked: boolean }>> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(
      `${baseUrl}/admin/users/${encodeURIComponent(userId)}/block`,
      {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ isBlocked }),
        cache: "no-store",
      },
    );
    const payload = (await res.json()) as AdminServiceResult<{
      id: string;
      isBlocked: boolean;
    }>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to update user status.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("toggleAdminUserBlock error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
