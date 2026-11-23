"use server";

import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type { SavedServiceResult } from "../saved.types";

export async function removeSavedService(
  serviceId: string,
): Promise<SavedServiceResult<null>> {
  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(
      `${API_BASE_URL}/saved/${encodeURIComponent(serviceId)}`,
      {
        method: "DELETE",
        headers: authHeaders,
        cache: "no-store",
      },
    );

    const payload = (await res.json()) as SavedServiceResult<null>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Could not remove saved service.",
      };
    }

    revalidatePath("/saved");
    revalidatePath("/dashboard");
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true, message: payload.message };
  } catch (error) {
    console.error("removeSavedService error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
