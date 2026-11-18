"use client";

import { AlertCircle, Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import type { BookingAction, BookingStatus } from "@/services/bookings.types";
import { updateBookingStatus } from "@/services/update/updateBookingStatus";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  viewerRole: "user" | "vendor" | "admin";
}

export function BookingActions({
  bookingId,
  status,
  viewerRole,
}: BookingActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<BookingAction | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAction = async (action: BookingAction) => {
    setErrorMessage(null);
    setLoadingAction(action);

    try {
      const res = await updateBookingStatus(bookingId, action);
      if (!res.success) {
        const msg = res.message || "Could not update booking status.";
        setErrorMessage(msg);
        toast.add({ title: "Action failed", description: msg, type: "error" });
        setLoadingAction(null);
        return;
      }

      toast.add({
        title: "Booking updated",
        description: res.message || "Status updated successfully.",
        type: "success",
      });
      setLoadingAction(null);
      router.refresh();
    } catch {
      const msg = "Unexpected error while updating booking.";
      setErrorMessage(msg);
      toast.add({ title: "Error", description: msg, type: "error" });
      setLoadingAction(null);
    }
  };

  // Per spec: Customer can cancel pending bookings only; Vendor approves/rejects pending only
  const canCustomerCancel = viewerRole === "user" && status === "pending";
  const canVendorDecide = viewerRole === "vendor" && status === "pending";

  if (!canCustomerCancel && !canVendorDecide) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {canCustomerCancel && (
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => handleAction("cancel")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/5 hover:bg-destructive/15 text-destructive text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loadingAction === "cancel" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            <span>Cancel Request</span>
          </button>
        )}

        {canVendorDecide && (
          <>
            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={() => handleAction("approve")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loadingAction === "approve" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Approve</span>
            </button>

            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={() => handleAction("reject")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/5 hover:bg-destructive/15 text-destructive text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loadingAction === "reject" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              <span>Reject</span>
            </button>
          </>
        )}
      </div>

      {errorMessage && (
        <p className="inline-flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}
