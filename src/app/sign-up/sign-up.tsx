"use client";

import {
  AlertCircle,
  Briefcase,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import {
  AuthBackButton,
  AuthDivider,
  AuthImageBanner,
  AuthSocialButton,
} from "@/components/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { uploadImageToImgBB } from "@/services/create/uploadImage";

export function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const explicitCallback = searchParams.get("callbackUrl");

  const [role, setRole] = useState<"user" | "vendor">(
    roleParam === "vendor" ? "vendor" : "user",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (roleParam === "vendor") {
      setRole("vendor");
    }
  }, [roleParam]);

  const isVendor = role === "vendor";
  const defaultDestination = isVendor ? "/vendor/dashboard" : "/dashboard";
  const redirectTarget = explicitCallback || defaultDestination;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadImageToImgBB(formData);
      if (res.success && res.url) {
        setImageUrl(res.url);
        toast.add({
          title: "Profile photo uploaded",
          type: "success",
        });
      } else {
        setErrorMessage(
          res.message || "Could not upload image. You can skip or try again.",
        );
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Spec password rules: minimum 6 chars, 1 uppercase, 1 lowercase
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMessage("Password must include at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setErrorMessage("Password must include at least one lowercase letter.");
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
        role,
        ...(imageUrl ? { image: imageUrl } : {}),
        callbackURL: redirectTarget,
      });

      if (response.error) {
        const msg =
          response.error.message || "Registration failed. Please try again.";
        setErrorMessage(msg);
        toast.add({ title: "Sign up failed", description: msg, type: "error" });
        setIsLoading(false);
        return;
      }

      toast.add({
        title: "Account created",
        description: `Welcome to WedPlan as a ${isVendor ? "Vendor" : "Customer"}!`,
        type: "success",
      });

      router.push(redirectTarget);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      toast.add({
        title: "Sign up error",
        description: message,
        type: "error",
      });
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
        <div className="max-w-105 mx-auto w-full">
          <AuthBackButton />
        </div>

        <div className="my-auto py-6 w-full max-w-105 mx-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isVendor ? "Vendor Registration" : "Create an Account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isVendor
                ? "Join WedPlan as a vendor to publish and manage your wedding services."
                : "Join WedPlan to discover top vendors and book your dream celebration."}
            </p>
          </div>

          {/* Account Role Selection (Customer vs Vendor) */}
          <div className="mt-6 p-1 rounded-2xl bg-muted/60 border border-border flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                !isVendor
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Heart className="w-3.5 h-3.5 text-primary" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                isVendor
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span>Vendor</span>
            </button>
          </div>

          {/* Social Sign Up */}
          <div className="mt-6">
            <AuthSocialButton
              callbackURL={redirectTarget}
              onError={(err) => setErrorMessage(err)}
            />
          </div>

          <AuthDivider />

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Optional Profile Image Upload (ImgBB) */}
            <div className="flex items-center gap-3.5">
              <Avatar className="size-12 rounded-full border border-border shrink-0">
                {imageUrl && (
                  <AvatarImage src={imageUrl} alt="Profile preview" />
                )}
                <AvatarFallback className="bg-primary-subtle text-primary text-xs font-bold">
                  {name ? name.slice(0, 2).toUpperCase() : "WP"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Profile Photo{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </p>
                <label className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isUploading
                      ? "Uploading to ImgBB..."
                      : imageUrl
                        ? "Change photo"
                        : "Upload photo file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="signup-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {isVendor ? "Business or Full Name" : "Full Name"}
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isVendor ? "Lumière Studio" : "Sarah Jenkins"}
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
                    placeholder="Min. 6 chars (Aa)"
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

            <p className="text-[11px] text-muted-foreground">
              Password requires at least 6 characters with uppercase and
              lowercase letters.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {isLoading
                  ? "Creating Account..."
                  : isVendor
                    ? "Register as Vendor"
                    : "Create Account"}
              </span>
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-muted-foreground max-w-105 mx-auto w-full">
          By registering, you agree to WedPlan&apos;s Terms of Service and
          Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default SignUp;
