import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Confidentialite | ATS Filter Resume",
  description: "Politique de confidentialite sur le traitement des CV et offres d'emploi.",
};

const DATA_POINTS = [
  "CV importe par l'utilisateur (PDF ou DOCX)",
  "Texte de l'offre d'emploi saisi manuellement",
  "Signaux d'analyse calcules (scores, exigences, recommandations)",
];

const SECURITY_CONTROLS = [
  "Validation stricte du format, du type MIME et de la taille des fichiers",
  "Traitement temporaire en memoire pour le parcours principal",
  "Messages d'erreur sans fuite de donnees personnelles",
  "Journalisation minimale sans contenu brut du CV",
  "Nettoyage automatique des rapports temporaires expires",
];

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] p-6 shadow-hard-xs sm:p-8">
        <Badge variant="info">Confidentialite</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--color-ink)] sm:text-4xl">
          Politique de confidentialite
        </h1>
        <p className="mt-3 max-w-4xl text-base leading-relaxed text-[var(--color-muted)]">
          ATS Filter Resume traite des donnees potentiellement sensibles. Cette page decrit clairement ce qui est
          collecte, pourquoi, comment c&apos;est protege et combien de temps c&apos;est conserve.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black text-[var(--color-ink)]">Donnees traitees</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
            {DATA_POINTS.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </Card>

        <Card className="bg-[var(--color-brand-light)]">
          <h2 className="text-xl font-black text-[var(--color-ink)]">Conservation des donnees</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
            <p>
              Les rapports sont conserves temporairement en memoire pour afficher les resultats, puis expires
              automatiquement selon la duree de retention configuree.
            </p>
            <p>
              Aucun stockage permanent n&apos;est necessaire pour le flux principal d&apos;analyse local/de demonstration.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black text-[var(--color-ink)]">Mesures de securite</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--color-muted)]">
            {SECURITY_CONTROLS.map((control) => (
              <li key={control}>- {control}</li>
            ))}
          </ul>
        </Card>

        <Card className="bg-[var(--color-surface)]">
          <h2 className="text-xl font-black text-[var(--color-ink)]">Responsabilite utilisateur</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
            <p>Ne transmettez pas de donnees non necessaires a l&apos;analyse ATS.</p>
            <p>Verifiez systematiquement le rapport avant toute decision de candidature.</p>
            <p>Si votre organisation impose des contraintes RGPD specifiques, adaptez votre usage en consequence.</p>
          </div>
        </Card>
      </section>

      <section className="rounded-[24px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-hard-xs sm:p-8">
        <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink)]">Transparence produit</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
          Le service fournit une estimation de compatibilite ATS. Il n&apos;exploite pas vos donnees pour des usages non
          declares dans ce projet et n&apos;accorde aucune garantie de recrutement.
        </p>
      </section>
    </div>
  );
}
