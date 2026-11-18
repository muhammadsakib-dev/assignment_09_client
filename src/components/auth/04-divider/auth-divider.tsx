import { cn } from "@/lib/utils";

interface AuthDividerProps {
  label?: string;
  className?: string;
}

export function AuthDivider({
  label = "or continue with email",
  className,
}: AuthDividerProps) {
  return (
    <div className={cn("relative my-5", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-3 text-muted-foreground font-medium tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}

export default AuthDivider;
