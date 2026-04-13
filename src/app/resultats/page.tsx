import { Suspense } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ResultsIndexClient } from "@/features/results/components/results-index-client";

export default function ResultsIndexPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardTitle>Chargement du rapport</CardTitle>
          <CardDescription className="mt-2">Initialisation de l&apos;affichage des resultats ATS.</CardDescription>
        </Card>
      }
    >
      <ResultsIndexClient />
    </Suspense>
  );
}
