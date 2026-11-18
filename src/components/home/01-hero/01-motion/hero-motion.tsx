"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

interface HeroMotionProviderProps {
  children: ReactNode;
}

// Honor OS reduced-motion preferences across all hero animations
export function HeroMotionProvider({ children }: HeroMotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: SMOOTH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScaleRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleReveal({
  children,
  delay = 0.1,
  className,
}: ScaleRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, delay, ease: SMOOTH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FloatCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FloatCard({
  children,
  delay = 0.35,
  className,
}: FloatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.6, delay, ease: SMOOTH_EASE },
        y: {
          duration: 5,
          delay: delay + 0.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
