"use server";

import { revalidatePath } from "next/cache";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  ProfileServiceResult,
  UpdateProfileInput,
  UserProfileRecord,
} from "../profile.types";

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<ProfileServiceResult<UserProfileRecord>> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: "Backend API URL is not configured." };
  }

  try {
    const authHeaders = await getAuthFetchHeaders(true);
    const res = await fetch(`${baseUrl}/profile`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify(input),
      cache: "no-store",
    });

    const payload =
      (await res.json()) as ProfileServiceResult<UserProfileRecord>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to update profile.",
      };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/vendor/dashboard");
    revalidatePath("/admin");

    return { success: true, message: payload.message, data: payload.data };
  } catch (error) {
    console.error("updateProfile error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}
