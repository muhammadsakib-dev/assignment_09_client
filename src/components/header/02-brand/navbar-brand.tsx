import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarBrandProps {
  logoUrl: string;
  className?: string;
}

export function NavbarBrand({ logoUrl, className }: NavbarBrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center shrink-0 group transition-transform hover:opacity-95",
        className,
      )}
      aria-label="WedPlan Home"
    >
      <Image
        src={logoUrl}
        alt="WedPlan Logo"
        width={130}
        height={34}
        priority
        className="h-14 sm:h-16 lg:h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
      />
    </Link>
  );
}

export default NavbarBrand;
