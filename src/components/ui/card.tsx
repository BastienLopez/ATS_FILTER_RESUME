import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-[20px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-hard-xs",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<"h2">) {
  return <h2 className={cn("text-lg font-black tracking-tight text-[var(--color-ink)]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("text-sm leading-relaxed text-[var(--color-muted)]", className)} {...props} />;
}
