"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { uploadImageToImgBB } from "@/crud/create/uploadImage";
import type { UserProfileRecord } from "@/crud/profile.types";
import { updateProfile } from "@/crud/update/updateProfile";

interface ProfileFormProps {
  profile: UserProfileRecord;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [image, setImage] = useState(profile.image);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "U";

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedback(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadImageToImgBB(formData);
      if (res.success && res.url) {
        setImage(res.url);
        setFeedback({
          type: "success",
          text: "Avatar uploaded. Click Save Changes to apply.",
        });
      } else {
        setFeedback({
          type: "error",
          text:
            res.message ||
            "Could not upload avatar. Paste an image URL instead.",
        });
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      const res = await updateProfile({
        name: name.trim(),
        image: image.trim(),
        phone: phone.trim(),
        location: location.trim(),
        ...(profile.role === "vendor"
          ? { businessName: businessName.trim() }
          : {}),
      });

      if (!res.success) {
        const msg = res.message || "Failed to update profile.";
        setFeedback({ type: "error", text: msg });
        toast.add({ title: "Update failed", description: msg, type: "error" });
        setIsLoading(false);
        return;
      }

      const msg = res.message || "Profile updated successfully.";
      setFeedback({ type: "success", text: msg });
      toast.add({
        title: "Profile updated",
        description: msg,
        type: "success",
      });
      setIsLoading(false);
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        text: "Unexpected error updating profile.",
      });
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6"
    >
      {/* Avatar & Read-only Role Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-border/70">
        <Avatar className="size-20 rounded-full border-2 border-border shadow-sm shrink-0">
          {image && <AvatarImage src={image} alt={name || "User avatar"} />}
          <AvatarFallback className="bg-primary-subtle text-primary text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">{name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary text-xs font-semibold capitalize">
              {profile.role}
            </span>
            {profile.role === "vendor" && (
              <span className="px-2.5 py-0.5 rounded-full border border-border bg-muted text-muted-foreground text-xs font-semibold capitalize">
                {profile.subscriptionPlan} Plan
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>
              {profile.role === "vendor"
                ? "Account role and subscription status are server-protected."
                : "Account role is server-protected."}
            </span>
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-2xl border p-3.5 flex items-start gap-2.5 text-sm ${
            feedback.type === "success"
              ? "bg-primary-subtle/60 border-primary/25 text-foreground"
              : "bg-destructive/10 border-destructive/25 text-destructive"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Editable Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="profile-name"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="profile-email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email Address (Read-only)
          </label>
          <input
            id="profile-email"
            type="email"
            disabled
            value={profile.email}
            className="w-full px-4 py-2.5 rounded-2xl border border-border bg-muted/50 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>

        {profile.role === "vendor" && (
          <div className="sm:col-span-2 space-y-1.5">
            <label
              htmlFor="profile-business"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Business / Studio Name
            </label>
            <input
              id="profile-business"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g., Lumière Visuals Studio"
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="profile-phone"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Phone Number
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1700-000000"
            className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="profile-location"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            City / Location
          </label>
          <input
            id="profile-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Dhaka, Bangladesh"
            className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label
            htmlFor="profile-image"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Profile Image URL (or Upload)
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="profile-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-muted/60 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer shrink-0 transition-colors">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 text-primary" />
              )}
              <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isLoading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}
