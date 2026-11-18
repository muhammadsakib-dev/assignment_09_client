"use client";

import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { AdminUserRecord } from "@/services/admin.types";
import { toggleAdminUserBlock } from "@/services/update/adminActions";

interface AdminUsersManagerProps {
  users: AdminUserRecord[];
  currentAdminId: string;
  errorMessage?: string;
}

export function AdminUsersManager({
  users,
  currentAdminId,
  errorMessage,
}: AdminUsersManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.businessName.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const handleToggleBlock = async (user: AdminUserRecord) => {
    setBusyId(user.id);
    try {
      const res = await toggleAdminUserBlock(user.id, !user.isBlocked);
      if (!res.success) {
        toast.add({
          title: "Action failed",
          description: res.message || "Could not update user status.",
          type: "error",
        });
      } else {
        toast.add({
          title: user.isBlocked ? "User unblocked" : "User blocked",
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
      {/* Search & Role Filter */}
      <div className="rounded-3xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center bg-muted/50 border border-border/80 rounded-2xl px-3.5">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search registered users by name or email..."
            aria-label="Search users"
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

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: "All", value: "all" },
            { label: "Customers", value: "user" },
            { label: "Vendors", value: "vendor" },
            { label: "Admins", value: "admin" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setRoleFilter(tab.value)}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border",
                roleFilter === tab.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <p className="text-xs text-muted-foreground">
        Showing <strong className="text-foreground">{filtered.length}</strong>{" "}
        registered {filtered.length === 1 ? "user" : "users"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card/70 p-10 text-center text-sm text-muted-foreground">
          No users matched your search or role filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => {
            const isSelf = u.id === currentAdminId;
            const initials = u.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((n) => n[0].toUpperCase())
              .join("");

            return (
              <article
                key={u.id}
                className="rounded-3xl border border-border/80 bg-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <Avatar className="size-11 rounded-full border border-border shrink-0">
                    {u.image && <AvatarImage src={u.image} alt={u.name} />}
                    <AvatarFallback className="bg-primary-subtle text-primary text-xs font-bold">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground truncate">
                        {u.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold uppercase tracking-wider">
                        {u.role}
                      </span>
                      {u.role === "vendor" && (
                        <span className="px-2.5 py-0.5 rounded-full border border-border bg-muted text-muted-foreground text-[10px] font-semibold uppercase">
                          {u.subscriptionPlan}
                        </span>
                      )}
                      {u.isBlocked && (
                        <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/25 text-[10px] font-bold uppercase">
                          Blocked
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{u.email}</span>
                      </span>
                      {u.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{u.phone}</span>
                        </span>
                      )}
                      {u.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{u.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelf ? (
                    <span className="text-xs font-medium text-muted-foreground px-3 py-1.5">
                      Current Admin
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === u.id}
                      onClick={() => handleToggleBlock(u)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 border",
                        u.isBlocked
                          ? "bg-primary-subtle text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground"
                          : "bg-destructive/5 text-destructive border-destructive/30 hover:bg-destructive/15",
                      )}
                    >
                      {busyId === u.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : u.isBlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Ban className="w-3.5 h-3.5" />
                      )}
                      <span>{u.isBlocked ? "Unblock User" : "Block User"}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
