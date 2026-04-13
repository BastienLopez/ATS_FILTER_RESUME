import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSearch, Gauge, ShieldCheck, Target } from "lucide-react";
import { CTAButton } from "@/components/landing/cta-button";
import { FeatureCard } from "@/components/landing/feature-card";
import { HeroCard } from "@/components/landing/hero-card";
import { SectionWrapper } from "@/components/landing/section-wrapper";
import { StepCard } from "@/components/landing/step-card";

const steps = [
  {
    step: "Etape 1",
    title: "Deposez votre CV",
    text: "Importez votre document en PDF ou DOCX. Le moteur extrait uniquement le texte lisible par ATS.",
  },
  {
    step: "Etape 2",
    title: "Ajoutez une offre (optionnel)",
    text: "Collez une offre cible pour activer la correspondance metier. Sans offre, l'outil passe en mode ATS general.",
  },
  {
    step: "Etape 3",
    title: "Corrigez avec precision",
    text: "Recevez un diagnostic clair: scores, risques de rejet automatise et actions a prioriser.",
  },
];

const benefits = [
  {
    title: "Scoring ATS transparent",
    text: "Chaque sous-score reste explicable: structure, lisibilite, correspondance, mots-cles et pre-requis.",
    icon: Gauge,
    accent: "brand" as const,
  },
  {
    title: "Diagnostic de rejet automatise",
    text: "Le rapport identifie les points qui freinent le passage ATS: sections manquantes, format riske, manque de preuves.",
    icon: ShieldCheck,
    accent: "soft" as const,
  },
  {
    title: "Recommandations actionnables",
    text: "Vous savez quoi corriger en premier, pourquoi c'est important et quel impact est attendu sur votre score.",
    icon: Target,
    accent: "light" as const,
  },
];

export default function HomePage() {
  return (
    <div className="-mx-[clamp(1rem,4vw,4.5rem)] overflow-x-clip">
      <SectionWrapper tone="base" className="border-t-0" innerClassName="pb-20 pt-12 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-1 text-xs font-black uppercase tracking-wide text-[var(--color-border)]">
                Laboratoire compatibilite ATS
              </span>
              <span className="rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1 text-xs font-black uppercase tracking-wide text-[var(--color-border)]">
                Diagnostic CV explicable
              </span>
            </div>

            <h1 className="max-w-5xl text-balance text-5xl font-black leading-[0.94] tracking-[-0.03em] text-[var(--color-ink)] md:text-6xl xl:text-7xl">
              Votre CV est-il vraiment compatible ATS ?
            </h1>

            <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-muted)] md:text-xl">
              Analysez votre CV en conditions reelles, comprenez ce qui bloque le filtrage automatise et obtenez un
              plan de correction concret en quelques minutes.
            </p>

            <div className="flex flex-wrap gap-3">
              <CTAButton href="/analyse">
                Analyser mon CV
                <ArrowRight className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
              </CTAButton>
              <CTAButton href="/ats" variant="secondary">
                Comprendre les ATS
              </CTAButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="border-l-2 border-[var(--color-border)] pl-3">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">Score global</p>
                <p className="mt-1 text-2xl font-black text-[var(--color-ink)]">0 - 100</p>
              </div>
              <div className="border-l-2 border-[var(--color-border)] pl-3">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">Sous-scores</p>
                <p className="mt-1 text-2xl font-black text-[var(--color-ink)]">6 dimensions</p>
              </div>
              <div className="border-l-2 border-[var(--color-border)] pl-3">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">Verdict ATS</p>
                <p className="mt-1 text-2xl font-black text-[var(--color-ink)]">Explicable</p>
              </div>
            </div>
          </div>

          <HeroCard />
        </div>
      </SectionWrapper>

      <SectionWrapper tone="surface">
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">Comment ca marche</h2>
            <Link
              href="/analyse"
              className="hidden text-sm font-black text-[var(--color-brand)] underline-offset-4 hover:underline md:inline-block"
            >
              Lancer une analyse
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((item) => (
              <StepCard key={item.step} step={item.step} title={item.title} text={item.text} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="violet">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1 text-xs font-black uppercase tracking-wide text-[var(--color-border)]">
              Education ATS
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[var(--color-ink)] md:text-5xl">
              Qu&apos;est-ce qu&apos;un ATS et pourquoi certains CV echouent ?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
              Un ATS lit d&apos;abord votre texte, puis compare votre profil aux exigences du poste. Un CV tres joli
              visuellement peut rester difficile a parser et etre filtre avant lecture humaine.
            </p>
            <Link
              href="/ats"
              className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--color-brand)]"
            >
              Lire le guide complet
              <ArrowRight className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-l-2 border-[var(--color-border)] pl-4">
              <FileSearch className="h-6 w-6 text-[var(--color-border)]" aria-hidden="true" suppressHydrationWarning />
              <p className="mt-3 text-lg font-black text-[var(--color-ink)]">Parsing du texte</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Structure, titres et lisibilite influencent directement le score ATS.
              </p>
            </div>
            <div className="border-l-2 border-[var(--color-border)] bg-[var(--color-brand-light)] pl-4">
              <Target className="h-6 w-6 text-[var(--color-border)]" aria-hidden="true" suppressHydrationWarning />
              <p className="mt-3 text-lg font-black text-[var(--color-ink)]">Correspondance des exigences</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Competences, outils et pre-requis sont compares point par point.
              </p>
            </div>
            <div className="border-l-2 border-[var(--color-border)] bg-[var(--color-surface)] pl-4 sm:col-span-2">
              <CheckCircle2 className="h-6 w-6 text-[var(--color-border)]" aria-hidden="true" suppressHydrationWarning />
              <p className="mt-3 text-lg font-black text-[var(--color-ink)]">Aucune promesse trompeuse</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Le produit estime la compatibilite ATS et les risques de rejet, jamais une garantie d&apos;embauche.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="base">
        <div className="space-y-6">
          <h2 className="text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">
            Un outil clair, pas une boite noire
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <FeatureCard
                key={benefit.title}
                title={benefit.title}
                text={benefit.text}
                icon={benefit.icon}
                accent={benefit.accent}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="surface" className="border-b-2 border-[var(--color-border)]">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[var(--color-ink)] md:text-5xl">
              Pret a optimiser votre CV pour les ATS ?
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
              Transformez votre candidature en diagnostic concret. Vous savez exactement quoi corriger en priorite pour
              augmenter vos chances de passage ATS.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CTAButton href="/analyse" className="w-full justify-center">
              Demarrer l&apos;analyse
            </CTAButton>
            <CTAButton href="/conditions" variant="secondary" className="w-full justify-center">
              Limites et transparence
            </CTAButton>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}


