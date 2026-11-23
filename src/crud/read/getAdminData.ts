"use server";

import { API_BASE_URL } from "@/config/env";
import { getAuthFetchHeaders } from "@/lib/server-api";
import type {
  AdminOverviewStats,
  AdminServiceResult,
  AdminTransactionRecord,
  AdminUserRecord,
} from "../admin.types";
import type { VendorServiceRecord } from "../vendor-services.types";

export async function getAdminOverview(): Promise<
  AdminServiceResult<AdminOverviewStats>
> {
  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/overview`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });
    const payload =
      (await res.json()) as AdminServiceResult<AdminOverviewStats>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load admin overview.",
      };
    }
    return { success: true, data: payload.data };
  } catch (error) {
    console.error("getAdminOverview error:", error);
    return { success: false, message: "Unable to connect to backend server." };
  }
}

export async function getAdminUsers(filters?: {
  search?: string;
  role?: string;
}): Promise<AdminServiceResult<AdminUserRecord[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.role && filters.role !== "all")
      params.set("role", filters.role);
    const query = params.toString();

    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(
      `${API_BASE_URL}/admin/users${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      },
    );
    const payload = (await res.json()) as AdminServiceResult<AdminUserRecord[]>;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load users.",
        data: [],
      };
    }
    return { success: true, data: payload.data ?? [] };
  } catch (error) {
    console.error("getAdminUsers error:", error);
    return {
      success: false,
      message: "Unable to connect to backend server.",
      data: [],
    };
  }
}

export async function getAdminServices(filters?: {
  search?: string;
  status?: string;
  category?: string;
}): Promise<AdminServiceResult<VendorServiceRecord[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.status && filters.status !== "all") {
      params.set("status", filters.status);
    }
    if (filters?.category && filters.category !== "all") {
      params.set("category", filters.category);
    }
    const query = params.toString();

    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(
      `${API_BASE_URL}/admin/services${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      },
    );
    const payload = (await res.json()) as AdminServiceResult<
      VendorServiceRecord[]
    >;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load services.",
        data: [],
      };
    }
    return { success: true, data: payload.data ?? [] };
  } catch (error) {
    console.error("getAdminServices error:", error);
    return {
      success: false,
      message: "Unable to connect to backend server.",
      data: [],
    };
  }
}

export async function getAdminTransactions(): Promise<
  AdminServiceResult<AdminTransactionRecord[]>
> {
  try {
    const authHeaders = await getAuthFetchHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/transactions`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });
    const payload = (await res.json()) as AdminServiceResult<
      AdminTransactionRecord[]
    >;
    if (!res.ok || !payload.success) {
      return {
        success: false,
        message: payload.message || "Failed to load transactions.",
        data: [],
      };
    }
    return { success: true, data: payload.data ?? [] };
  } catch (error) {
    console.error("getAdminTransactions error:", error);
    return {
      success: false,
      message: "Unable to connect to backend server.",
      data: [],
    };
  }
}
