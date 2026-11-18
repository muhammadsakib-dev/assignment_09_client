export type VendorServiceStatus = "pending" | "approved" | "rejected";

export interface VendorServiceRecord {
  id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  highlights: string[];
  status: VendorServiceStatus;
  isActive: boolean;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorIsPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorServiceInput {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  highlights?: string[];
}

export interface UpdateVendorServiceInput {
  serviceName?: string;
  category?: string;
  description?: string;
  price?: number;
  location?: string;
  images?: string[];
  highlights?: string[];
  isActive?: boolean;
}

export interface VendorServiceResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}
