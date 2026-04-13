import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  text: string;
  icon: LucideIcon;
  accent?: "brand" | "soft" | "light" | "neutral";
}

const accentClass: Record<NonNullable<FeatureCardProps["accent"]>, string> = {
  brand: "bg-[var(--color-brand-light)]",
  soft: "bg-[var(--color-surface-muted)]",
  light: "bg-[var(--color-surface-muted)]",
  neutral: "bg-[var(--color-surface)]",
};

export function FeatureCard({ title, text, icon: Icon, accent = "neutral" }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group border-l-2 border-[var(--color-border)] px-4 py-1 transition",
        accentClass[accent],
      )}
    >
      <Icon className="h-7 w-7 text-[var(--color-border)]" aria-hidden="true" suppressHydrationWarning />
      <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-[var(--color-ink)]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{text}</p>
    </article>
  );
}

