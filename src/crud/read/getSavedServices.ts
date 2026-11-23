"use server";

import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type { SavedServiceRecord, SavedServiceResult } from "../saved.types";

export async function getSavedServices(): Promise<
  SavedServiceResult<SavedServiceRecord[]>
> {
  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(`${API_BASE_URL}/saved`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const payload = (await res.json()) as SavedServiceResult<
      SavedServiceRecord[]
    >;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load saved services.",
        data: [],
      };
    }

    return {
      success: true,
      message: payload.message,
      data: payload.data ?? [],
    };
  } catch (error) {
    console.error("getSavedServices error:", error);
    return {
      success: false,
      message: "Unable to connect to backend server.",
      data: [],
    };
  }
}
