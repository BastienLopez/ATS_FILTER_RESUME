import { cn } from "@/lib/utils";

interface ScoreChipProps {
  score: number;
  label: string;
}

function toneClass(score: number) {
  if (score >= 80) {
    return "border-emerald-700 bg-emerald-50 text-emerald-900";
  }
  if (score >= 60) {
    return "border-orange-700 bg-orange-50 text-orange-900";
  }
  return "border-red-800 bg-red-100 text-red-950";
}

export function ScoreChip({ score, label }: ScoreChipProps) {
  return (
    <div className={cn("rounded-[14px] border px-3 py-2", toneClass(score))}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-black leading-none">{Math.round(score)}</p>
    </div>
  );
}
