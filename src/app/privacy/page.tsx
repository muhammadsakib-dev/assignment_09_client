import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WedPlan",
  description:
    "How WedPlan protects customer, vendor, and booking data across the platform.",
};

export default function PrivacyPage() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3 pb-6 border-b border-border/70">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Your wedding plans, contact details, and vendor business data are
            handled securely and transparently.
          </p>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">
              1. Information We Collect
            </h2>
            <p>
              We collect account registration details (name, email, optional
              profile photo, and role), wedding service listings submitted by
              vendors, and booking inquiry details (event date, location, and
              guest notes) submitted by customers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">
              2. How We Use Your Data
            </h2>
            <p>
              Information is used exclusively to connect couples with approved
              wedding vendors, manage booking request statuses, verify account
              access via Better Auth &amp; JWT, and moderate published listings.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">
              3. Data Security
            </h2>
            <p>
              Authentication secrets, database credentials, and API keys are
              stored strictly server-side. Users cannot escalate roles or access
              another account&apos;s private dashboard data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
