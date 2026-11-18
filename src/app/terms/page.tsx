import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | WedPlan",
  description:
    "Platform guidelines for couples, wedding vendors, and administrators on WedPlan.",
};

export default function TermsPage() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3 pb-6 border-b border-border/70">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Clear rules for browsing services, submitting booking inquiries, and
            publishing vendor listings on WedPlan.
          </p>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">
              1. Vendor Listings &amp; Approval
            </h2>
            <p>
              All vendor-submitted wedding services enter Pending review before
              becoming visible to couples. Free Plan vendors may publish up to 3
              active services; Premium vendors enjoy unlimited active listings.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">
              2. Booking Requests
            </h2>
            <p>
              Customers may submit booking inquiries for approved services and
              cancel pending requests at any time. Vendors may approve or reject
              pending inquiries for their own listings only.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">
              3. Account Conduct
            </h2>
            <p>
              Administrators reserve the right to reject inappropriate listings
              or block accounts that violate platform integrity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
