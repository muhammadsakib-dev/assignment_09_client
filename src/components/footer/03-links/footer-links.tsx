import Link from "next/link";
import type { FooterLinkItem } from "../footer-data";

interface FooterLinksProps {
  title: string;
  links: readonly FooterLinkItem[];
}

export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h2>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
