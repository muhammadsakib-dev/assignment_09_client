import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_DATA } from "../footer-data";

export function FooterContact() {
  const { contact } = FOOTER_DATA;

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Contact Us
      </h2>
      <ul className="space-y-3 text-sm text-muted-foreground">
        <li>
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-start gap-2.5 hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{contact.email}</span>
          </a>
        </li>
        <li>
          <a
            href={`tel:${contact.phone.replace(/\s+/g, "")}`}
            className="inline-flex items-start gap-2.5 hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{contact.phone}</span>
          </a>
        </li>
        <li className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>{contact.address}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>{contact.hours}</span>
        </li>
      </ul>
    </div>
  );
}
