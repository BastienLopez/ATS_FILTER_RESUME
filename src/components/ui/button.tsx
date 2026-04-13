import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--color-border)] bg-[var(--color-brand)] text-white hover:-translate-y-0.5 hover:bg-[#6d28d9]",
  secondary:
    "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-border)] hover:-translate-y-0.5 hover:bg-[var(--color-surface-muted)]",
  ghost:
    "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-border)] hover:-translate-y-0.5 hover:bg-[var(--color-surface)]",
  danger: "border-red-900 bg-red-700 text-white hover:-translate-y-0.5 hover:bg-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[16px] border-2 font-bold uppercase tracking-wide transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        "shadow-hard-md",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Analyse en cours..." : children}
    </button>
  );
});
