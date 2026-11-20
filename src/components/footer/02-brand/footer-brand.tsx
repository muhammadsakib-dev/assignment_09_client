import Image from "next/image";
import Link from "next/link";
import { FOOTER_DATA, type SocialPlatform } from "../footer-data";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case "facebook":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
  }
}

export function FooterBrand() {
  const { brand, socials } = FOOTER_DATA;

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center hover:opacity-90 transition-opacity dark:bg-foreground/95 dark:px-3 dark:py-0.5 dark:rounded-2xl"
        aria-label="WedPlan Home"
      >
        <Image
          src={brand.logoUrl}
          alt="WedPlan Logo"
          width={140}
          height={40}
          className="h-14 sm:h-16 w-auto object-contain"
        />
      </Link>

      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
        {brand.description}
      </p>

      {/* Social Media Links */}
      <div className="flex items-center gap-2.5 pt-1">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow WedPlan on ${social.name}`}
            className="w-9 h-9 rounded-full border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary-subtle transition-all"
          >
            <SocialIcon platform={social.platform} />
          </a>
        ))}
      </div>
    </div>
  );
}
