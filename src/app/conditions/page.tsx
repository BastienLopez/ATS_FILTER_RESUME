import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | ATS Filter Resume",
  description: "Conditions d'utilisation du service d'analyse ATS.",
};

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-[var(--color-brand-light)]">
        <Badge variant="info">Juridique</Badge>
        <CardTitle className="mt-3 text-2xl">Conditions d&apos;utilisation</CardTitle>
        <CardDescription className="mt-3">
          En utilisant ATS Filter Resume, vous acceptez ces conditions. Le service fournit une estimation technique de
          compatibilite ATS, sans promesse de resultat de recrutement.
        </CardDescription>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Usage autorise</CardTitle>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
            <li>- Utilisation personnelle ou professionnelle pour evaluation de CV.</li>
            <li>- Respect des lois applicables en matiere de donnees personnelles.</li>
            <li>- Interdiction d&apos;usage malveillant ou de tentative de surcharge du service.</li>
          </ul>
        </Card>

        <Card className="bg-[var(--color-brand-light)]">
          <CardTitle>Limitation de responsabilite</CardTitle>
          <CardDescription className="mt-3">
            Le service est fourni &quot;tel quel&quot;. L&apos;editeur ne garantit ni entretien, ni embauche, ni
            taux de reponse. L&apos;utilisateur reste responsable de ses decisions de candidature.
          </CardDescription>
        </Card>
      </div>

      <Card>
        <CardTitle>Evolution du service</CardTitle>
        <CardDescription className="mt-3">
          Les regles d&apos;analyse et l&apos;interface peuvent evoluer pour ameliorer la qualite du diagnostic. Les
          nouvelles versions prennent effet a leur publication.
        </CardDescription>
      </Card>
    </div>
  );
}

