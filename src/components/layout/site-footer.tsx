import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)]">
      <div className="grid w-full gap-8 px-[clamp(1rem,4vw,4.5rem)] py-12 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] p-4 text-[var(--color-ink)] shadow-hard-xs">
          <p className="text-sm font-black uppercase tracking-wide">ATS Filter Resume</p>
          <p className="mt-2 text-sm font-medium">
            Diagnostic ATS transparent pour comprendre la compatibilite de votre CV avec une offre donnee.
          </p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--color-muted)]">Produit</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/analyse" className="font-semibold hover:text-[var(--color-ink)]">
                Analyse CV
              </Link>
            </li>
            <li>
              <Link href="/ats" className="font-semibold hover:text-[var(--color-ink)]">
                Guide ATS
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--color-muted)]">Institutionnel</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/a-propos" className="font-semibold hover:text-[var(--color-ink)]">
                A propos
              </Link>
            </li>
            <li>
              <Link href="/conditions" className="font-semibold hover:text-[var(--color-ink)]">
                Conditions
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="font-semibold hover:text-[var(--color-ink)]">
                Confidentialite
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] p-4 shadow-hard-xs">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--color-muted)]">Transparence</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            L&apos;outil mesure une estimation de passage ATS. Il ne garantit jamais un entretien ni une embauche.
          </p>
        </div>
      </div>
    </footer>
  );
}
