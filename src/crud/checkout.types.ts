export type BillingCycle = "monthly" | "yearly";

export interface CheckoutSessionData {
  id: string;
  url: string;
}

export interface CheckoutVerificationData {
  sessionId: string;
  status: string;
  webhookVerified: boolean;
  plan: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface VendorTransactionRecord {
  id: string;
  sessionId: string;
  plan: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface CheckoutServiceResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
