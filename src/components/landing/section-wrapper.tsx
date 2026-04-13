import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTone = "base" | "surface" | "yellow" | "mint" | "violet" | "ink";

interface SectionWrapperProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  tone?: SectionTone;
  innerClassName?: string;
}

const toneClasses: Record<SectionTone, string> = {
  base: "bg-[var(--color-bg)] text-[var(--color-ink)]",
  surface: "bg-[var(--color-surface)] text-[var(--color-ink)]",
  yellow: "bg-[var(--color-brand-light)] text-[var(--color-ink)]",
  mint: "bg-[var(--color-surface-muted)] text-[var(--color-ink)]",
  violet: "bg-[var(--color-brand-light)] text-[var(--color-ink)]",
  ink: "bg-[var(--color-panel-dark)] text-white",
};

export function SectionWrapper({
  children,
  tone = "base",
  className,
  innerClassName,
  ...props
}: SectionWrapperProps) {
  return (
    <section className={cn("w-full border-t-2 border-[var(--color-border)]", toneClasses[tone], className)} {...props}>
      <div className={cn("px-[clamp(1rem,4vw,4.5rem)] py-12 md:py-16 lg:py-20", innerClassName)}>{children}</div>
    </section>
  );
}
