export interface SavedServiceRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  serviceImage: string;
  price: number;
  location: string;
  vendorName: string;
  createdAt: string;
}

export interface SaveServiceInput {
  serviceId: string;
}

export interface SavedServiceResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}
