"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface AuthSocialButtonProps {
  role?: "customer" | "user" | "vendor";
  callbackURL?: string;
  disabled?: boolean;
  className?: string;
  onError?: (error: string) => void;
}

export function AuthSocialButton({
  role,
  callbackURL = "/",
  disabled = false,
  className,
  onError,
}: AuthSocialButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      // Persist chosen role in a short-lived cookie so backend OAuth callback knows customer vs vendor
      if (role) {
        document.cookie = `wedplan_pending_role=${encodeURIComponent(role)}; path=/; max-age=600; SameSite=Lax`;
      }

      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        ...(role ? { additionalData: { role } } : {}),
      } as Parameters<typeof authClient.signIn.social>[0]);
    } catch (err: unknown) {
      setIsLoading(false);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initiate Google sign-in";
      onError?.(message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className={cn(
        "w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-2xl border border-border bg-card hover:bg-muted/50 text-foreground text-sm font-medium transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        className,
      )}
      aria-label="Continue with Google"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      ) : (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      )}
      <span>Continue with Google</span>
    </button>
  );
}

export default AuthSocialButton;
