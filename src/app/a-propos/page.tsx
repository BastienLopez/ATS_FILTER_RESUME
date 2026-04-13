import type { Metadata } from "next";
import { CheckCircle2, Gauge, ShieldCheck, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "A propos | ATS Filter Resume",
  description: "Vision produit, methode ATS et principes de transparence.",
};

const PRINCIPLES = [
  {
    icon: Gauge,
    title: "Scoring transparent",
    text: "Chaque sous-score est calcule avec des regles explicables: mots-cles, prerequis, structure, lisibilite et qualite d'experience.",
  },
  {
    icon: ShieldCheck,
    title: "Honnetete produit",
    text: "Le service mesure la compatibilite ATS et les risques de rejet automatise. Il ne promet jamais un entretien ou une embauche.",
  },
  {
    icon: Target,
    title: "Action concrete",
    text: "Le rapport ne s'arrete pas au score: il propose des recommandations priorisees, contextualisees et directement applicables.",
  },
];

const SCORE_WEIGHTS = [
  { label: "Couverture competences / mots-cles", value: "35%" },
  { label: "Prerequis obligatoires", value: "20%" },
  { label: "Structure ATS", value: "15%" },
  { label: "Lisibilite du document", value: "10%" },
  { label: "Qualite de l'experience", value: "10%" },
  { label: "Qualite globale du contenu", value: "10%" },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] p-6 shadow-hard-xs sm:p-8">
        <Badge variant="info">Produit</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--color-ink)] sm:text-4xl">
          A propos d&apos;ATS Filter Resume
        </h1>
        <p className="mt-3 max-w-4xl text-base leading-relaxed text-[var(--color-muted)]">
          ATS Filter Resume aide les candidats a comprendre comment leur CV est interprete par un filtre ATS. Notre
          objectif est de transformer une candidature floue en diagnostic clair, lisible et actionnable.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {PRINCIPLES.map((item) => (
          <Card key={item.title} className="bg-[var(--color-surface)]">
            <item.icon className="h-6 w-6 text-[var(--color-brand)]" aria-hidden="true" suppressHydrationWarning />
            <h2 className="mt-3 text-lg font-black text-[var(--color-ink)]">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-xl font-black text-[var(--color-ink)]">Methode d&apos;analyse ATS</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--color-muted)]">
            <p>
              Le moteur combine un parsing deterministe du CV, une extraction de signaux metier et une evaluation de
              prerequis proches des pratiques ATS d&apos;entreprise.
            </p>
            <p>
              Nous appliquons des penalites fortes sur les cas critiques: texte non extractible, sections majeures
              absentes, contact incomplet ou exigences obligatoires non couvertes.
            </p>
            <p>
              Le resultat final reste interpretable: vous voyez les raisons du score, les risques detectes et l&apos;ordre
              de correction recommande.
            </p>
          </div>
        </Card>

        <Card className="bg-[var(--color-brand-light)]">
          <h2 className="text-xl font-black text-[var(--color-ink)]">Ponderations du score</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
            {SCORE_WEIGHTS.map((weight) => (
              <li key={weight.label} className="flex items-center justify-between gap-3 border-b border-stone-300 pb-2 last:border-b-0">
                <span>{weight.label}</span>
                <span className="font-black text-[var(--color-ink)]">{weight.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-hard-xs sm:p-8">
        <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink)]">Ce que le produit n&apos;est pas</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--color-muted)]">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-brand)]" aria-hidden="true" suppressHydrationWarning />
            <span>Ce n&apos;est pas un outil de promesse d&apos;embauche.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-brand)]" aria-hidden="true" suppressHydrationWarning />
            <span>Ce n&apos;est pas une IA opaque sans explication des decisions.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-brand)]" aria-hidden="true" suppressHydrationWarning />
            <span>Ce n&apos;est pas un remplacement de l&apos;evaluation humaine finale.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
