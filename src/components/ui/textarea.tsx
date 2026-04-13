import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[180px] w-full rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm leading-relaxed text-[var(--color-ink)] shadow-hard-xs outline-none placeholder:text-[var(--color-muted)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      />
    );
  },
);
