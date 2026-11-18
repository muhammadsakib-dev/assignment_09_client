export type BookingStatus = "pending" | "booked" | "cancelled" | "rejected";

export type BookingAction = "cancel" | "approve" | "reject";

export interface BookingRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  serviceImage: string;
  price: number;
  location: string;
  customerId: string;
  userId: string;
  userName: string;
  userEmail: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  serviceId: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  message?: string;
}

export interface BookingServiceResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}
