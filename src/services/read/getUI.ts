// V-1
import type { UIData, UIResponse } from "@/types/getUI_types";

// Fetch all UI data directly from the backend
export async function getUI(): Promise<UIData> {
  const baseUrl = process.env.API_BASE_URL;

  const res = await fetch(`${baseUrl}/ui`, {
    next: { revalidate: 3600 }, // Cache on server, revalidate every hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch UI data: ${res.status} ${res.statusText}`);
  }

  const response: UIResponse = await res.json();
  return response.data;
}

export default getUI;
