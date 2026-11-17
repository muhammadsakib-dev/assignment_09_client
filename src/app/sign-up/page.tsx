import type { Metadata } from "next";
import { Suspense } from "react";
import SignUpSkeleton from "@/suspense/sign-up-skeleton";
import SignUp from "./sign-up";

export const metadata: Metadata = {
  title: "Create Account | WedPlan",
  description:
    "Join WedPlan to plan your wedding celebration or list your premier wedding services.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpSkeleton />}>
      <SignUp />
    </Suspense>
  );
}
