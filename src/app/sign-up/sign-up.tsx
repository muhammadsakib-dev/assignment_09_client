"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  AuthBackButton,
  AuthDivider,
  AuthImageBanner,
  AuthSocialButton,
} from "@/components/auth";
import { authClient } from "@/lib/auth-client";

export function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVendor = searchParams.get("role") === "vendor";
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role: isVendor ? "vendor" : "user",
        callbackURL: callbackUrl,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message || "Registration failed. Please try again.",
        );
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Visual Photo Banner */}
      <AuthImageBanner
        title={
          isVendor ? "Grow Your Wedding Business" : "Plan Your Dream Wedding"
        }
        quote={
          isVendor
            ? "WedPlan connects passionate wedding vendors with couples planning their special day."
            : "Find premier venues, photographers, florists, and catering with ease and peace of mind."
        }
        author={
          isVendor ? "WedPlan Vendor Network" : "Start your forever journey"
        }
        imageSrc={
          isVendor
            ? "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding%20vendor.jpg"
            : "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_02.png"
        }
      />

      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 w-full min-h-screen">
        {/* Top Header: Back Button */}
        <div className="max-w-105 mx-auto w-full">
          <AuthBackButton />
        </div>

        {/* Center: Auth Card & Form */}
        <div className="my-auto py-6 w-full max-w-105 mx-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
              {isVendor ? "Vendor Registration" : "Create an Account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isVendor
                ? "Join WedPlan as a vendor to showcase your wedding services."
                : "Join WedPlan to plan your wedding and connect with top vendors."}
            </p>
          </div>

          {/* Social Sign Up */}
          <div className="mt-8">
            <AuthSocialButton
              callbackURL={callbackUrl}
              onError={(err) => setErrorMessage(err)}
            />
          </div>

          <AuthDivider />

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="signup-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="signup-email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="signup-password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-2.5 pr-11 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="signup-confirm-password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Confirm Password
                </label>
                <input
                  id="signup-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {isLoading ? "Creating Account..." : "Create Account"}
              </span>
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Bottom Terms Notice */}
        <div className="pt-6 text-center text-xs text-muted-foreground max-w-105 mx-auto w-full">
          By registering, you agree to WedPlan&apos;s Terms of Service and
          Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default SignUp;
