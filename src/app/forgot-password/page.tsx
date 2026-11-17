import type { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordSkeleton from "@/suspense/forgot-password-skeleton";
import ForgotPassword from "./forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password | WedPlan",
  description:
    "Reset your WedPlan account password securely via email verification.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPassword />
    </Suspense>
  );
}
