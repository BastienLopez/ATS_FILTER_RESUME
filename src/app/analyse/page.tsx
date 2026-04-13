import type { Metadata } from "next";
import { Lock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnalysisForm } from "@/features/analysis/components/analysis-form";

export const metadata: Metadata = {
  title: "Analyser mon CV | ATS Filter Resume",
  description: "Importez votre CV puis obtenez un diagnostic ATS detaille, avec ou sans offre d'emploi.",
};

export default function AnalysePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="space-y-4">
        <section className="space-y-3 border-l-2 border-[var(--color-border)] pl-4">
          <Badge variant="info">Parcours analyse</Badge>
          <h2 className="text-lg font-black tracking-tight text-[var(--color-ink)]">Ce qui est analyse</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
            <li>Compatibilite ATS et lisibilite du document.</li>
            <li>Couverture des mots-cles et competences demandees (si offre fournie).</li>
            <li>Pre-requis obligatoires (langue, annees, outils, certifications) quand disponibles.</li>
            <li>Structure CV, sections critiques et qualite des experiences.</li>
          </ul>
        </section>

        <Card className="bg-[var(--color-brand-light)]">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 text-[var(--color-ink)]" aria-hidden="true" suppressHydrationWarning />
            <div>
              <h3 className="text-lg font-black text-[var(--color-ink)]">Confidentialite</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                Aucun stockage permanent par defaut. Les rapports sont conserves temporairement en memoire pour
                afficher les resultats, puis expires automatiquement.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 text-[var(--color-ink)]" aria-hidden="true" suppressHydrationWarning />
            <p className="text-sm text-[var(--color-muted)]">
              Entrees validees strictement: format, taille, et contenu minimum.
            </p>
          </div>
        </Card>
      </aside>

      <AnalysisForm />
    </div>
  );
}

