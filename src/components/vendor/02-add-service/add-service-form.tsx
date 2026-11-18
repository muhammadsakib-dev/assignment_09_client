"use client";

import {
  AlertCircle,
  Check,
  Crown,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { SERVICE_CATEGORIES } from "@/components/services/services-data";
import { toast } from "@/components/ui/toast";
import { createVendorService } from "@/services/create/createVendorService";
import { uploadImageToImgBB } from "@/services/create/uploadImage";

interface AddServiceFormProps {
  activeCount: number;
  subscriptionPlan: "free" | "premium";
}

const FREE_PLAN_LIMIT = 3;

export function AddServiceForm({
  activeCount,
  subscriptionPlan,
}: AddServiceFormProps) {
  const router = useRouter();
  const isPremium = subscriptionPlan === "premium";
  const isAtFreeLimit = !isPremium && activeCount >= FREE_PLAN_LIMIT;

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<string>(SERVICE_CATEGORIES[0].name);
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Dhaka");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    const trimmed = imageInput.trim();
    if (!trimmed.startsWith("http")) {
      setErrorMessage("Please enter a valid HTTP/HTTPS image URL.");
      return;
    }
    if (images.length >= 6) {
      setErrorMessage("Maximum 6 images allowed per service.");
      return;
    }
    setErrorMessage(null);
    setImages((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setImageInput("");
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 6) {
      setErrorMessage("Maximum 6 images allowed per service.");
      e.target.value = "";
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadImageToImgBB(formData);
      if (res.success && res.url) {
        const uploadedUrl = res.url;
        setImages((prev) => [...prev, uploadedUrl]);
        toast.add({
          title: "Image uploaded",
          description: "Added to your service gallery.",
          type: "success",
        });
      } else {
        const msg =
          res.message || "Upload failed. You can also paste an image URL.";
        setErrorMessage(msg);
        toast.add({ title: "Upload failed", description: msg, type: "error" });
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddHighlight = () => {
    const trimmed = highlightInput.trim();
    if (!trimmed) return;
    if (highlights.length >= 10) return;
    setHighlights((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed],
    );
    setHighlightInput("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Include any URL still typed inside the input field
    const finalImages = [...images];
    if (imageInput.trim().startsWith("http") && finalImages.length < 6) {
      finalImages.push(imageInput.trim());
    }

    if (finalImages.length === 0) {
      setErrorMessage("Please upload or add at least one service image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createVendorService({
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images: finalImages,
        highlights,
      });

      if (!res.success) {
        const msg = res.message || "Could not submit service.";
        setErrorMessage(msg);
        toast.add({
          title: "Submission failed",
          description: msg,
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      toast.add({
        title: "Service submitted to MongoDB",
        description:
          "Your service is now Pending and will go live once approved by an Admin.",
        type: "success",
      });

      router.push("/vendor/services");
      router.refresh();
    } catch {
      const msg = "Unexpected error while publishing service.";
      setErrorMessage(msg);
      toast.add({ title: "Error", description: msg, type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Free Plan Quota Alert */}
      {isAtFreeLimit && (
        <div className="rounded-3xl border border-primary/30 bg-primary-subtle/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                Free Plan Active Limit Reached ({activeCount}/{FREE_PLAN_LIMIT})
              </p>
              <p className="text-xs text-muted-foreground">
                Pause an existing listing in My Services or upgrade to Premium
                to publish unlimited services.
              </p>
            </div>
          </div>
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold shrink-0"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6"
      >
        {errorMessage && (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-3.5 flex items-start gap-2.5 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label
              htmlFor="add-svc-name"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Service Name
            </label>
            <input
              id="add-svc-name"
              type="text"
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g., Lumière Signature Wedding Photography & Cinema"
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="add-svc-category"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Service Category
            </label>
            <select
              id="add-svc-category"
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
              htmlFor="add-svc-price"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Starting Price (USD)
            </label>
            <input
              id="add-svc-price"
              type="number"
              min={0}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1500"
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label
              htmlFor="add-svc-location"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              City / Service Location
            </label>
            <input
              id="add-svc-location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dhaka"
              className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        {/* Multi-Image Upload / URL Builder */}
        <div className="space-y-3 pt-2 border-t border-border/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Service Images ({images.length}/6)
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload image files via ImgBB or paste direct image URLs. The first
              image is used as the cover photo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://ik.imagekit.io/..."
              aria-label="Service image URL"
              className="flex-1 px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2.5 rounded-2xl border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer shrink-0"
            >
              Add URL
            </button>
            <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-subtle hover:bg-primary text-primary hover:text-primary-foreground text-xs font-semibold cursor-pointer shrink-0 transition-colors">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
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

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {images.map((url, idx) => (
                <div
                  key={url}
                  className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border bg-muted group"
                >
                  <Image
                    src={url}
                    alt={`Service preview ${idx + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    aria-label="Remove image"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-card/90 text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Highlights Builder */}
        <div className="space-y-3 pt-2 border-t border-border/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Package Highlights (Optional)
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              List key inclusions displayed under &ldquo;What&apos;s
              Included&rdquo; on the Service Details page.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddHighlight();
                }
              }}
              placeholder="e.g., Full 10-hour event coverage & drone aerials"
              aria-label="Add package highlight"
              className="flex-1 px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              type="button"
              onClick={handleAddHighlight}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {highlights.length > 0 && (
            <ul className="space-y-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 border border-border/70 px-3.5 py-2 text-xs text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setHighlights((prev) => prev.filter((h) => h !== item))
                    }
                    aria-label="Remove highlight"
                    className="text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5 pt-2 border-t border-border/70">
          <label
            htmlFor="add-svc-desc"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Full Service Description
          </label>
          <textarea
            id="add-svc-desc"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your experience, package details, deliverables, and booking terms..."
            className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            New services default to <strong>Pending</strong> until approved by
            an Admin.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || isAtFreeLimit}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? "Publishing..." : "Publish Service"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
