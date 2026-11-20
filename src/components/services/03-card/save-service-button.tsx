"use client";

import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { saveService } from "@/crud/create/saveService";
import { removeSavedService } from "@/crud/delete/removeSavedService";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface SaveServiceButtonProps {
  serviceId: string;
  serviceName: string;
  initialSaved?: boolean;
  className?: string;
}

export function SaveServiceButton({
  serviceId,
  serviceName,
  initialSaved = false,
  className,
}: SaveServiceButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  // Only customers save wedding services
  if (session?.user?.role === "vendor" || session?.user?.role === "admin") {
    return null;
  }

  const handleToggle = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/services")}`);
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        const res = await removeSavedService(serviceId);
        if (res.success) {
          setIsSaved(false);
          toast.add({ title: "Removed from saved services", type: "success" });
          router.refresh();
        } else {
          toast.add({
            title: "Could not remove",
            description: res.message,
            type: "error",
          });
        }
      } else {
        const res = await saveService({ serviceId });
        if (res.success) {
          setIsSaved(true);
          toast.add({
            title: "Saved to favorites",
            description: serviceName,
            type: "success",
          });
          router.refresh();
        } else {
          toast.add({
            title: "Could not save",
            description: res.message,
            type: "error",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isSaved ? "Remove from saved services" : "Save service"}
      aria-pressed={isSaved}
      className={cn(
        "w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shrink-0",
        isSaved
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card/90 text-foreground/80 border-border/80 hover:text-primary hover:bg-card",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Heart className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
      )}
    </button>
  );
}
