"use server";

import { IMGBB_API_KEY } from "@/config/env";

export interface UploadImageResult {
  success: boolean;
  url?: string;
  message?: string;
}

// Server-side ImgBB upload keeps IMGBB_API_KEY strictly off the client bundle
export async function uploadImageToImgBB(
  formData: FormData,
): Promise<UploadImageResult> {
  const apiKey = IMGBB_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      message:
        "IMGBB_API_KEY is not configured in .env. Please paste an image URL instead.",
    };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Please select an image file." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, message: "Image must be smaller than 10MB." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const params = new URLSearchParams();
    params.append("image", base64);
    if (file.name) {
      params.append("name", file.name.replace(/\.[^/.]+$/, ""));
    }

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      },
    );

    const payload = (await res.json()) as {
      success?: boolean;
      data?: { url?: string; display_url?: string };
      error?: { message?: string };
    };

    if (!res.ok || !payload.success || !(payload.data?.url || payload.data?.display_url)) {
      return {
        success: false,
        message: payload.error?.message || "Image upload failed.",
      };
    }

    return {
      success: true,
      url: payload.data.url || payload.data.display_url,
    };
  } catch (error) {
    console.error("uploadImageToImgBB error:", error);
    return {
      success: false,
      message: "Failed to upload image. Please check your network or paste an image URL.",
    };
  }
}
