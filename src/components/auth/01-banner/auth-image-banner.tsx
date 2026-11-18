import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthImageBannerProps {
  title?: string;
  quote?: string;
  author?: string;
  imageSrc?: string;
  className?: string;
}

export function AuthImageBanner({
  title = "Start Your Forever Story",
  quote = "WedPlan helped us find our dream venue and the most extraordinary photographer in just days.",
  author = "Sarah & Liam — Married in Tuscany",
  imageSrc = "https://ik.imagekit.io/muhammadsakib/Assignment_09/wedding_01.jpg",
  className,
}: AuthImageBannerProps) {
  return (
    <div
      className={cn(
        "relative hidden lg:flex flex-col justify-between p-10 xl:p-14 lg:w-[58%] xl:w-[62%] 2xl:w-[65%] shrink-0 overflow-hidden bg-muted select-none",
        className,
      )}
    >
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt="Romantic wedding celebration"
        fill
        priority
        className="object-cover"
        sizes="(min-width: 1024px) 65vw, 100vw"
      />

      {/* Elegant Dark & Tint Gradient Overlay */}
      <div className="absolute inset-0" />

      {/* Top Header / Branding */}
      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-opacity"
        >
          <span className="text-2xl font-bold tracking-tight text-white">
            Wed<span className="text-blush-pink">Plan</span>
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white/90 font-medium">
            Plan • Book • Celebrate ✨
          </span>
        </Link>
      </div>

      {/* Bottom Content / Testimonial Card */}
      <div className="relative z-10 max-w-lg space-y-4">
        <div className="rounded-3xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 p-6 text-white shadow-2xl">
          <h2 className="text-2xl font-semibold tracking-tight leading-snug">
            {title}
          </h2>
          <p className="mt-2 text-sm text-white/85 italic leading-relaxed">
            "{quote}"
          </p>
          <p className="mt-3 text-xs font-medium text-white/70 uppercase tracking-wider">
            {author}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthImageBanner;
