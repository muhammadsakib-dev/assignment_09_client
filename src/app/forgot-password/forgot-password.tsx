"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthBackButton, AuthImageBanner } from "@/components/auth";
import { ThemeToggle } from "@/components/theme";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Email submission state
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset password state (when token exists)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const handleSendResetEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message ||
            "Failed to send reset link. Please check the email.",
        );
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      setIsLoading(false);
      toast.add({
        title: "Verification link sent",
        description: `Check ${email} for your password reset link.`,
        type: "success",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setErrorMessage(
        "Password must include at least one uppercase and one lowercase letter.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!token) {
      setErrorMessage("Missing reset token.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message || "Reset link has expired or is invalid.",
        );
        setIsLoading(false);
        return;
      }

      setIsResetSuccess(true);
      setIsLoading(false);
      toast.add({
        title: "Password updated",
        description: "You can now sign in with your new password.",
        type: "success",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <AuthImageBanner
        title="Secure Account Recovery"
        quote="We take security seriously so you can focus on celebrating the love that brought you here."
        author="WedPlan Security"
        imageSrc="https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_02.png"
      />

      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 w-full min-h-screen">
        <div className="max-w-105 mx-auto w-full flex items-center justify-between gap-2">
          <AuthBackButton href="/login" label="Back to sign in" />
          <ThemeToggle variant="icon" />
        </div>

        <div className="my-auto py-6 w-full max-w-105 mx-auto">
          {token ? (
            // Phase 2: User arrived with reset token
            <div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Set New Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Please choose a strong new password for your WedPlan account.
                </p>
              </div>

              {isResetSuccess ? (
                <div className="mt-8 p-6 rounded-2xl bg-card border border-border text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Password Reset Complete
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully updated. Redirecting to
                    sign in...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2.5 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="reset-new-password"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="reset-new-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                      htmlFor="reset-confirm-password"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="reset-confirm-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>
                      {isLoading ? "Updating Password..." : "Update Password"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          ) : isSubmitted ? (
            // Phase 1B: Email confirmation sent
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Verification Link Sent
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We have sent a secure password reset link to{" "}
                  <strong className="text-foreground">{email}</strong>. Please
                  check your inbox and click the link to update your password.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-border bg-card hover:bg-muted text-sm font-medium transition-colors cursor-pointer"
                >
                  Try another email
                </button>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium transition-colors"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            // Phase 1A: Email input form
            <div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your registered email address and we will send you a
                  verification link to reset your password.
                </p>
              </div>

              {errorMessage && (
                <div className="mt-6 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2.5 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSendResetEmail} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Registered Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {isLoading ? "Sending Link..." : "Send Verification Link"}
                  </span>
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 text-center text-xs text-muted-foreground max-w-105 mx-auto w-full">
          Protected by WedPlan security. If you need immediate assistance,
          contact support.
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
