"use server";

import { getAuthFetchHeaders } from "@/lib/server-api";
import type { SavedServiceRecord, SavedServiceResult } from "../saved.types";

export async function getSavedServices(): Promise<
  SavedServiceResult<SavedServiceRecord[]>
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
    const res = await fetch(`${baseUrl}/saved`, {
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
