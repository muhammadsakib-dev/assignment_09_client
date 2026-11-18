export interface CheckoutSessionData {
  id: string;
  url: string;
}

export interface CheckoutVerificationData {
  sessionId: string;
  status: string;
  plan: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface CheckoutServiceResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
