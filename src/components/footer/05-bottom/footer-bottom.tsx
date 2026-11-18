import Link from "next/link";
import { FOOTER_DATA } from "../footer-data";

export function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-12 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
      <p>
        &copy; {currentYear} {FOOTER_DATA.brand.name}. All rights reserved.
      </p>

      <div className="flex items-center gap-6">
        {FOOTER_DATA.legalLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
