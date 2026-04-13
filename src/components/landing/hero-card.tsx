import { CheckCircle2, TriangleAlert } from "lucide-react";

export function HeroCard() {
  return (
    <article className="relative overflow-hidden rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-hard-lg md:p-8">
      <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-brand-light)]" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-brand)] px-4 py-3 text-white shadow-hard-xs">
          <p className="text-xs font-black uppercase tracking-wide">Estimation passage ATS</p>
          <p className="text-3xl font-black leading-none">82</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] p-3 shadow-hard-xs">
            <p className="text-xs font-black uppercase tracking-wide">Compatibilite ATS</p>
            <p className="mt-1 text-xl font-black">86 / 100</p>
          </div>
          <div className="rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-hard-xs">
            <p className="text-xs font-black uppercase tracking-wide">Correspondance offre</p>
            <p className="mt-1 text-xl font-black">79 / 100</p>
          </div>
        </div>

        <div className="space-y-2 rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 shadow-hard-xs">
          <p className="text-xs font-black uppercase tracking-wide">Synthese express</p>
          <div className="flex items-start gap-2 text-sm font-semibold">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700" aria-hidden="true" suppressHydrationWarning />
            11 mots-cles critiques detectes dans le CV
          </div>
          <div className="flex items-start gap-2 text-sm font-semibold">
            <TriangleAlert className="mt-0.5 h-4 w-4 text-amber-700" aria-hidden="true" suppressHydrationWarning />
            2 prerequis obligatoires a renforcer
          </div>
        </div>
      </div>
    </article>
  );
}

