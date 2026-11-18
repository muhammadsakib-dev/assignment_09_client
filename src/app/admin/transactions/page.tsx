import { AlertCircle, CreditCard, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard";
import { auth } from "@/lib/auth";
import { getAdminTransactions } from "@/services/read/getAdminData";
import { DashboardSkeleton } from "@/suspense/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Transactions | Admin | WedPlan",
  description: "Read-only audit log of vendor subscription transactions.",
};

async function AdminTransactionsContent() {
  const res = await getAdminTransactions();
  const transactions = res.data ?? [];

  if (!res.success) {
    return (
      <div className="rounded-3xl border border-destructive/25 bg-destructive/5 p-6 flex items-start gap-3 text-sm text-destructive">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <span>{res.message}</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/70 p-12 text-center space-y-3">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
          <CreditCard className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          No Transactions Recorded Yet
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Verified Stripe subscription transactions will appear here in
          read-only format once payment integration is enabled.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span>
          Read-only ledger — payment statuses are verified exclusively via
          server webhooks.
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3.5">Vendor</th>
              <th className="px-5 py-3.5">Plan</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-muted/20">
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">
                    {tx.vendorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.vendorEmail}
                  </p>
                </td>
                <td className="px-5 py-4 capitalize font-medium text-foreground">
                  {tx.plan}
                </td>
                <td className="px-5 py-4 font-bold text-foreground">
                  ${tx.amount.toLocaleString()} {tx.currency.toUpperCase()}
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold capitalize">
                    {tx.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminTransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/transactions");
  }
  if (session.user.isBlocked) {
    redirect("/login?error=blocked");
  }
  if (session.user.role !== "admin") {
    redirect(
      session.user.role === "vendor" ? "/vendor/dashboard" : "/dashboard",
    );
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: "admin",
      }}
      badge="Payments Audit"
      title="Platform Transactions"
      description="Read-only record of vendor subscription payments."
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminTransactionsContent />
      </Suspense>
    </DashboardShell>
  );
}
