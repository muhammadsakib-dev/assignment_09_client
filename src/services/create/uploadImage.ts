"use server";

export interface UploadImageResult {
  success: boolean;
  url?: string;
  message?: string;
}

// Server-side ImgBB upload keeps IMGBB_API_KEY strictly off the client bundle
export async function uploadImageToImgBB(
  formData: FormData,
): Promise<UploadImageResult> {
  const apiKey = process.env.IMGBB_API_KEY;
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

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: "Image must be smaller than 5MB." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const uploadBody = new FormData();
    uploadBody.append("image", base64);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadBody,
        cache: "no-store",
      },
    );

    const payload = (await res.json()) as {
      success?: boolean;
      data?: { url?: string };
      error?: { message?: string };
    };

    if (!res.ok || !payload.success || !payload.data?.url) {
      return {
        success: false,
        message: payload.error?.message || "Image upload failed.",
      };
    }

    return { success: true, url: payload.data.url };
  } catch (error) {
    console.error("uploadImageToImgBB error:", error);
    return { success: false, message: "Failed to upload image to ImgBB." };
  }
}
