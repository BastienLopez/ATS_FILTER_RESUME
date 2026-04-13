interface StepCardProps {
  step: string;
  title: string;
  text: string;
}

export function StepCard({ step, title, text }: StepCardProps) {
  return (
    <article className="border-l-2 border-[var(--color-border)] pl-4">
      <p className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-black uppercase tracking-wide">
        {step}
      </p>
      <h3 className="mt-4 text-xl font-black tracking-tight text-[var(--color-ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{text}</p>
    </article>
  );
}
