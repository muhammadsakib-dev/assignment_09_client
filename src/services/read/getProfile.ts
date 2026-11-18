"use server";

import { getAuthFetchHeaders } from "@/lib/server-api";
import type { ProfileServiceResult, UserProfileRecord } from "../profile.types";

export async function getProfile(): Promise<
  ProfileServiceResult<UserProfileRecord>
> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(`${baseUrl}/profile`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const payload =
      (await res.json()) as ProfileServiceResult<UserProfileRecord>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load profile.",
      };
    }

    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("getProfile error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
