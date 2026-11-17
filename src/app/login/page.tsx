import type { Metadata } from "next";
import { Suspense } from "react";
import LoginSkeleton from "@/suspense/login-skeleton";
import Login from "./login";

export const metadata: Metadata = {
  title: "Sign In | WedPlan",
  description:
    "Sign in to your WedPlan account to manage your wedding planning and vendor services.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <Login />
    </Suspense>
  );
}
