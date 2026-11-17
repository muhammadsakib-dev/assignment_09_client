// Type definitions for UI data
export interface NavItem {
	name: string;
	href: string;
}

export interface UIData {
	navbar: {
		navItems: NavItem[];
		navItemsAdmin: NavItem[];
	};
	[key: string]: unknown;
}

export interface UIResponse {
	success: boolean;
	message?: string;
	data: UIData;
}

// Fetch all UI data from the backend
export async function getUI(): Promise<UIData> {
	
	const baseUrl =process.env.API_BASE_URL as string;
		
	try {
		const res = await fetch(`${baseUrl}/ui`, {
			next: { revalidate: 3600 }, // Cache on server, revalidate every hour
		});

		if (!res.ok) {
			throw new Error(
				`Failed to fetch UI data: ${res.status} ${res.statusText}`,
			);
		}

		const response: UIResponse = await res.json();
		return response.data;
	} catch (error) {
		console.error("Error in getUI service:", error);
		throw error;
	}
}

export default getUI;
