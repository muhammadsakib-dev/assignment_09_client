"use client";

import {
  AlertCircle,
  Check,
  Loader2,
  Mail,
  MapPin,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SERVICE_CATEGORIES } from "@/components/services/services-data";
import { toast } from "@/components/ui/toast";
import { deleteAdminService } from "@/crud/delete/deleteAdminService";
import { updateAdminServiceStatus } from "@/crud/update/adminActions";
import type {
  VendorServiceRecord,
  VendorServiceStatus,
} from "@/crud/vendor-services.types";
import { cn } from "@/lib/utils";

interface AdminServicesManagerProps {
  services: VendorServiceRecord[];
  errorMessage?: string;
}

const STATUS_BADGE: Record<VendorServiceStatus, string> = {
  pending:
    "bg-champagne/60 text-foreground border-border dark:bg-champagne/15 dark:text-champagne dark:border-champagne/25",
  approved: "bg-primary text-primary-foreground border-primary",
  rejected: "bg-destructive/10 text-destructive border-destructive/25",
};

export function AdminServicesManager({
  services,
  errorMessage,
}: AdminServicesManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((s) => {
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesCat =
        categoryFilter === "all" || s.category === categoryFilter;
      const matchesQuery =
        !q ||
        s.serviceName.toLowerCase().includes(q) ||
        s.vendorName.toLowerCase().includes(q) ||
        s.vendorEmail.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q);
      return matchesStatus && matchesCat && matchesQuery;
    });
  }, [services, search, statusFilter, categoryFilter]);

  const handleStatusChange = async (
    serviceId: string,
    status: VendorServiceStatus,
  ) => {
    setBusyId(serviceId);
    try {
      const res = await updateAdminServiceStatus(serviceId, status);
      if (!res.success) {
        toast.add({
          title: "Moderation failed",
          description: res.message || "Could not update service status.",
          type: "error",
        });
      } else {
        toast.add({
          title: `Service ${status}`,
          description: res.message,
          type: "success",
        });
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (serviceId: string) => {
    setBusyId(serviceId);
    try {
      const res = await deleteAdminService(serviceId);
      if (!res.success) {
        toast.add({
          title: "Delete failed",
          description: res.message || "Could not delete service.",
          type: "error",
        });
      } else {
        toast.add({
          title: "Service deleted",
          description: res.message,
          type: "success",
        });
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  };

  if (errorMessage) {
    return (
      <div className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 flex items-start gap-3 text-sm text-destructive">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <span>{errorMessage}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search, Status & Category Filters */}
      <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative flex items-center bg-muted/50 border border-border/80 rounded-2xl px-3.5">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service name, vendor, email, or city..."
              aria-label="Search submitted services"
              className="w-full bg-transparent px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-6 flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="px-3.5 py-2 rounded-2xl border border-border bg-background text-xs font-semibold text-foreground cursor-pointer"
            >
              <option value="all">All Categories</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {["all", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={cn(
                  "px-3.5 py-2 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer border",
                  statusFilter === st
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground",
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card/70 p-12 text-center text-sm text-muted-foreground">
          No submitted wedding services matched your filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <article
              key={s.id}
              className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs flex flex-col md:flex-row gap-5"
            >
              <div className="relative aspect-16/10 md:aspect-square md:w-36 md:h-36 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-muted">
                <Image
                  src={
                    s.images?.[0] ||
                    "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_01.jpg"
                  }
                  alt={s.serviceName}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-primary">
                        {s.category}
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        {s.serviceName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full border text-xs font-semibold capitalize",
                          STATUS_BADGE[s.status],
                        )}
                      >
                        {s.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                        {s.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {s.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{s.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>
                        {s.vendorName} ({s.vendorEmail})
                      </span>
                    </span>
                    <strong className="text-foreground">
                      ${s.price.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Admin Moderation Controls */}
                <div className="pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {s.status !== "approved" && (
                      <button
                        type="button"
                        disabled={busyId === s.id}
                        onClick={() => handleStatusChange(s.id, "approved")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {busyId === s.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Approve</span>
                      </button>
                    )}

                    {s.status !== "rejected" && (
                      <button
                        type="button"
                        disabled={busyId === s.id}
                        onClick={() => handleStatusChange(s.id, "rejected")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/5 hover:bg-destructive/15 text-destructive text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => handleDelete(s.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border hover:border-destructive/40 text-muted-foreground hover:text-destructive text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
