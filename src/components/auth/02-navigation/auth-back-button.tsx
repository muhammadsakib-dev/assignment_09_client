import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthBackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function AuthBackButton({
  href = "/",
  label = "Back to home",
  className,
}: AuthBackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group px-3 py-1.5 rounded-full hover:bg-muted/50 -ml-2",
        className,
      )}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </Link>
  );
}

export default AuthBackButton;
