import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

const badgeClasses: Record<BadgeVariant, string> = {
  neutral: "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-border)]",
  success: "border-emerald-800 bg-emerald-100 text-emerald-900",
  warning: "border-amber-800 bg-amber-100 text-amber-900",
  danger: "border-red-800 bg-red-100 text-red-900",
  info: "border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[var(--color-brand)]",
};

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 px-2.5 py-1 text-xs font-semibold tracking-wide",
        badgeClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
