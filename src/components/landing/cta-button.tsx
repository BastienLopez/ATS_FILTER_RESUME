import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CTAButtonVariant = "primary" | "secondary";

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: CTAButtonVariant;
  className?: string;
}

const variantClasses: Record<CTAButtonVariant, string> = {
  primary:
    "bg-[var(--color-brand)] text-white hover:-translate-y-0.5 hover:bg-[#6d28d9]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-border)] hover:-translate-y-0.5 hover:bg-[var(--color-surface-muted)]",
};

export function CTAButton({ href, children, variant = "primary", className }: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-[16px] border-2 border-[var(--color-border)] px-6 text-sm font-black uppercase tracking-wide shadow-hard-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
