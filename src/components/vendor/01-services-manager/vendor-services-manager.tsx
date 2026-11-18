"use client";

import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Power,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { SERVICE_CATEGORIES } from "@/components/services/services-data";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { uploadImageToImgBB } from "@/services/create/uploadImage";
import { deleteVendorService } from "@/services/delete/deleteVendorService";
import { updateVendorService } from "@/services/update/updateVendorService";
import type {
  VendorServiceRecord,
  VendorServiceStatus,
} from "@/services/vendor-services.types";

interface VendorServicesManagerProps {
  services: VendorServiceRecord[];
  subscriptionPlan: "free" | "premium";
  errorMessage?: string;
}

const FREE_PLAN_LIMIT = 3;

const STATUS_BADGE: Record<VendorServiceStatus, string> = {
  pending: "bg-champagne/60 text-foreground border-border",
  approved: "bg-primary text-primary-foreground border-primary",
  rejected: "bg-destructive/10 text-destructive border-destructive/25",
};

export function VendorServicesManager({
  services,
  subscriptionPlan,
  errorMessage,
}: VendorServicesManagerProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<string>(SERVICE_CATEGORIES[0].name);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Dhaka");
  const [imageUrl, setImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isPremium = subscriptionPlan === "premium";
  const activeCount = services.filter(
    (s) => s.isActive && s.status !== "rejected",
  ).length;
  const isAtFreeLimit = !isPremium && activeCount >= FREE_PLAN_LIMIT;

  const resetForm = () => {
    setEditingId(null);
    setServiceName("");
    setCategory(SERVICE_CATEGORIES[0].name);
    setDescription("");
    setPrice("");
    setLocation("Dhaka");
    setImageUrl("");
    setIsFormOpen(false);
  };

  const openEditForm = (item: VendorServiceRecord) => {
    setFeedback(null);
    setEditingId(item.id);
    setServiceName(item.serviceName);
    setCategory(item.category);
    setDescription(item.description);
    setPrice(String(item.price));
    setLocation(item.location);
    setImageUrl(item.images[0] || "");
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedback(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadImageToImgBB(formData);
      if (res.success && res.url) {
        setImageUrl(res.url);
        setFeedback({ type: "success", text: "Image uploaded successfully." });
      } else {
        setFeedback({
          type: "error",
          text: res.message || "Upload failed. Paste an image URL instead.",
        });
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const payload = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images: [imageUrl.trim()],
      };

      const res = await updateVendorService(editingId, payload);

      if (!res.success) {
        setFeedback({
          type: "error",
          text: res.message || "Could not update service.",
        });
        setIsSubmitting(false);
        return;
      }

      const successMsg = res.message || "Service updated successfully.";
      setFeedback({ type: "success", text: successMsg });
      toast.add({
        title: "Service updated",
        description: successMsg,
        type: "success",
      });
      resetForm();
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: VendorServiceRecord) => {
    setFeedback(null);
    setBusyId(item.id);
    try {
      const res = await updateVendorService(item.id, {
        isActive: !item.isActive,
      });
      if (!res.success) {
        const msg = res.message || "Could not update availability.";
        setFeedback({ type: "error", text: msg });
        toast.add({ title: "Action failed", description: msg, type: "error" });
      } else {
        toast.add({
          title: item.isActive ? "Service paused" : "Service activated",
          type: "success",
        });
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (serviceId: string) => {
    setFeedback(null);
    setBusyId(serviceId);
    try {
      const res = await deleteVendorService(serviceId);
      if (!res.success) {
        const msg = res.message || "Could not delete service.";
        setFeedback({ type: "error", text: msg });
        toast.add({ title: "Delete failed", description: msg, type: "error" });
      } else {
        setFeedback({ type: "success", text: "Service deleted." });
        toast.add({ title: "Service deleted", type: "success" });
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Usage Bar & Add Button */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              {isPremium
                ? "Premium Plan — Unlimited Listings"
                : "Free Plan Usage"}
            </span>
            {isPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
                <Crown className="w-3 h-3" />
                <span>Premium</span>
              </span>
            )}
          </div>
          {!isPremium && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                <strong>
                  {activeCount} / {FREE_PLAN_LIMIT}
                </strong>{" "}
                active services published.{" "}
                {isAtFreeLimit && (
                  <Link
                    href="/vendor/subscription"
                    className="text-primary font-semibold hover:underline"
                  >
                    Upgrade to Premium for unlimited listings
                  </Link>
                )}
              </p>
              <div className="h-2 w-56 max-w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min((activeCount / FREE_PLAN_LIMIT) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Link
          href="/vendor/add-service"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Feedback Banner */}
      {(feedback || errorMessage) && (
        <div
          className={cn(
            "rounded-2xl border p-4 flex items-start gap-2.5 text-sm",
            feedback?.type === "success"
              ? "bg-primary-subtle/60 border-primary/25 text-foreground"
              : "bg-destructive/10 border-destructive/25 text-destructive",
          )}
        >
          {feedback?.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{feedback?.text || errorMessage}</span>
        </div>
      )}

      {/* Add / Edit Service Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-7 shadow-md space-y-5"
        >
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70">
            <h2 className="text-lg font-bold text-foreground">
              Edit Wedding Service
            </h2>
            <button
              type="button"
              onClick={resetForm}
              aria-label="Close service form"
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="svc-name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Service Name
              </label>
              <input
                id="svc-name"
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., Royal Floral Stage & Lighting"
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="svc-category"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Category
              </label>
              <select
                id="svc-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="svc-price"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Starting Price (USD)
              </label>
              <input
                id="svc-price"
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1200"
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="svc-location"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                City / Location
              </label>
              <input
                id="svc-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dhaka"
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Image URL + Optional ImgBB File Upload */}
          <div className="space-y-1.5">
            <label
              htmlFor="svc-image"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Service Cover Image (URL or ImgBB Upload)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="svc-image"
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ik.imagekit.io/..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-muted/60 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer shrink-0 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-primary" />
                )}
                <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="svc-description"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Description
            </label>
            <textarea
              id="svc-description"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's included in your wedding package..."
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card/70 p-12 text-center space-y-3">
          <h3 className="text-lg font-bold text-foreground">
            No Services Published Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Create your first wedding service listing. New listings start as{" "}
            <strong>Pending</strong> until reviewed by an admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col"
            >
              <div className="relative aspect-16/9 w-full bg-muted">
                {item.images[0] && (
                  <Image
                    src={item.images[0]}
                    alt={item.serviceName}
                    fill
                    sizes="(min-width: 768px) 40vw, 94vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full border text-[11px] font-semibold capitalize",
                      STATUS_BADGE[item.status],
                    )}
                  >
                    {item.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-md text-foreground text-[11px] font-semibold">
                    {item.isActive ? "Active" : "Paused"}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-primary">
                    {item.category}
                  </p>
                  <h3 className="text-base font-bold text-foreground">
                    {item.serviceName}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{item.location}</span>
                    </span>
                    <strong className="text-base text-foreground">
                      ${item.price.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Vendor Actions */}
                <div className="pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => handleToggleActive(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer disabled:opacity-50"
                  >
                    <Power className="w-3.5 h-3.5 text-primary" />
                    <span>{item.isActive ? "Pause" : "Activate"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-subtle text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
