export interface UserProfileRecord {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "user" | "vendor" | "admin";
  phone: string;
  location: string;
  businessName: string;
  subscriptionPlan: "free" | "premium";
}

export interface UpdateProfileInput {
  name: string;
  image?: string;
  phone?: string;
  location?: string;
  businessName?: string;
}

export interface ProfileServiceResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}
