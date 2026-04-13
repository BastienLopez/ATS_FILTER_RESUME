import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

function getTone(value: number) {
  if (value >= 80) {
    return "bg-emerald-500";
  }
  if (value >= 60) {
    return "bg-orange-500";
  }
  return "bg-red-500";
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-3 w-full overflow-hidden rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-hard-xs",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        className={cn("block h-full transition-all duration-500 ease-out", getTone(clamped))}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
