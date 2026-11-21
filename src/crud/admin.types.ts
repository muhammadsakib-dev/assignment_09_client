export interface AdminOverviewStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "user" | "customer" | "vendor" | "admin";
  isBlocked: boolean;
  businessName: string;
  phone: string;
  location: string;
  subscriptionPlan: "free" | "premium";
  createdAt: string;
}

export interface AdminTransactionRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AdminServiceResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}
