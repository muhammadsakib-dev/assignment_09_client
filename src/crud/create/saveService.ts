"use server";

import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  SavedServiceRecord,
  SavedServiceResult,
  SaveServiceInput,
} from "../saved.types";

export async function saveService(
  input: SaveServiceInput,
): Promise<SavedServiceResult<SavedServiceRecord>> {
  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(`${API_BASE_URL}/saved`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ serviceId: input.serviceId }),
      cache: "no-store",
    });

    const payload =
      (await res.json()) as SavedServiceResult<SavedServiceRecord>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Could not save service.",
      };
    }

    revalidatePath("/saved");
    revalidatePath("/dashboard");
    revalidatePath("/services");
    revalidatePath("/");
    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("saveService error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
