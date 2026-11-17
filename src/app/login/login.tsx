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

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: callbackUrl,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message || "Invalid credentials. Please try again.",
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
      {/* Visual Photo Banner (Left Side on Desktop) */}
      <AuthImageBanner
        title="Welcome Back to WedPlan"
        quote="Every detail of your celebration, curated with elegance and joy."
        author="Celebrate effortlessly"
        imageSrc="https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_01.jpg"
      />

      {/* Form Container (Right Side) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 w-full min-h-screen">
        {/* Top Header: Back Button */}
        <div className="max-w-105 mx-auto w-full">
          <AuthBackButton />
        </div>

        {/* Center: Auth Card & Form */}
        <div className="my-auto py-6 w-full max-w-105 mx-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
              Sign In
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Please enter your details to access your account.
            </p>
          </div>

          {/* Social Sign In */}
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

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary-hover hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Bottom Terms Notice */}
        <div className="pt-6 text-center text-xs text-muted-foreground max-w-105 mx-auto w-full">
          By signing in, you agree to WedPlan&apos;s Terms of Service and
          Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default Login;
