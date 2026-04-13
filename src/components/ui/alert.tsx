import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "warning" | "danger" | "success";

const styles: Record<AlertVariant, string> = {
  info: "border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[#432a82]",
  warning: "border-amber-800 bg-amber-100 text-amber-950",
  danger: "border-red-800 bg-red-100 text-red-950",
  success: "border-emerald-800 bg-emerald-100 text-emerald-950",
};

interface AlertProps {
  title: string;
  description: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

export function Alert({ title, description, variant = "info", className }: AlertProps) {
  return (
    <div className={cn("rounded-[16px] border-2 p-4 shadow-hard-xs", styles[variant], className)} role="status">
      <p className="text-sm font-black">{title}</p>
      <p className="mt-1 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
