import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck } from "lucide-react";
import { atsEducationSections, atsFaq, atsMistakesToAvoid } from "@/content/education";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Guide ATS | ATS Filter Resume",
  description: "Comprendre ce qu'est un ATS, comment il lit un CV et comment optimiser sa candidature.",
};

const ATS_STEPS = [
  {
    title: "1. Extraction du texte",
    text: "Le systeme lit uniquement le texte exploitable. Les PDF scannes, tableaux complexes ou icones peuvent masquer des informations.",
  },
  {
    title: "2. Normalisation",
    text: "Les termes sont normalises (accents, variantes, acronymes) pour comparer votre CV a des criteres metier standardises.",
  },
  {
    title: "3. Detection des sections",
    text: "Le moteur cherche un squelette lisible: titre, resume, experience, formation, competences, langues, certifications.",
  },
  {
    title: "4. Verification des prerequis",
    text: "Les exigences obligatoires sont controlees en priorite: outils, langues, annees d'experience, diplome, localisation.",
  },
  {
    title: "5. Classement de compatibilite",
    text: "Un score calcule la compatibilite ATS et signale les risques de rejet automatise, avec recommandations actionnables.",
  },
];

export default function AtsEducationPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] p-6 shadow-hard-xs sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <Badge variant="info">Guide ATS pratique</Badge>
            <h1 className="text-3xl font-black tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
              Comprendre les ATS sans jargon
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">
              Cette page explique comment les ATS analysent un CV en entreprise, ce qui bloque un passage automatique
              et comment optimiser votre document de facon concrete.
            </p>
            <Link href="/analyse" className="inline-block">
              <Button>
                Analyser mon CV
                <ArrowRight className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
              </Button>
            </Link>
          </div>

          <Card className="bg-[var(--color-surface)]">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 text-[var(--color-brand)]" aria-hidden="true" suppressHydrationWarning />
                <div>
                  <p className="text-sm font-black text-[var(--color-ink)]">Ce que ce guide couvre</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Lecture ATS, scoring, prerequis bloquants et plan d&apos;optimisation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" aria-hidden="true" suppressHydrationWarning />
                <div>
                  <p className="text-sm font-black text-[var(--color-ink)]">Positionnement honnete</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Compatibilite ATS estimee, jamais de garantie d&apos;embauche.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-hard-xs sm:p-8">
        <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink)] sm:text-3xl">Comment un ATS lit votre CV</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ATS_STEPS.map((step) => (
            <article key={step.title} className="border-l-2 border-[var(--color-border)] pl-4">
              <p className="text-sm font-black text-[var(--color-ink)]">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black text-[var(--color-ink)]">Ce qu&apos;un recruteur ATS veut voir</h2>
          <div className="mt-4 space-y-3">
            {atsEducationSections.map((section) => (
              <article key={section.title} className="border-l-2 border-[var(--color-border)] pl-3">
                <p className="text-sm font-black text-[var(--color-ink)]">{section.title}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{section.body}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="bg-[var(--color-brand-light)]">
          <h2 className="text-xl font-black text-[var(--color-ink)]">Erreurs frequentes a eviter</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--color-muted)]">
            {atsMistakesToAvoid.map((mistake) => (
              <li key={mistake} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-brand)]" aria-hidden="true" suppressHydrationWarning />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-hard-xs sm:p-8">
        <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink)]">FAQ ATS</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {atsFaq.map((item) => (
            <article key={item.q} className="rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
              <p className="text-sm font-black text-[var(--color-ink)]">{item.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] p-6 shadow-hard-xs sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink)]">Passez a l&apos;action</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Testez votre CV sur une offre reelle pour savoir precisement ce qui passe ou bloque cote ATS.
            </p>
          </div>
          <Link href="/analyse">
            <Button>
              Lancer une analyse
              <ArrowRight className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
