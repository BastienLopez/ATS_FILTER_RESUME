import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-ink)] shadow-hard-xs outline-none placeholder:text-[var(--color-muted)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
});
