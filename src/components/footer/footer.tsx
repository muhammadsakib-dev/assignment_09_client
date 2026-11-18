import { FooterBrand } from "./02-brand/footer-brand";
import { FooterLinks } from "./03-links/footer-links";
import { FooterContact } from "./04-contact/footer-contact";
import { FooterBottom } from "./05-bottom/footer-bottom";
import { FOOTER_DATA } from "./footer-data";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Socials */}
          <div className="sm:col-span-2 lg:col-span-4">
            <FooterBrand />
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <FooterLinks title="Explore" links={FOOTER_DATA.quickLinks} />
          </div>

          {/* Column 3: Wedding Services */}
          <div className="lg:col-span-3">
            <FooterLinks
              title="Wedding Services"
              links={FOOTER_DATA.serviceLinks}
            />
          </div>

          {/* Column 4: Contact Info */}
          <div className="lg:col-span-3">
            <FooterContact />
          </div>
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}

export default Footer;
