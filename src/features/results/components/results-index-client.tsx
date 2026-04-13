"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ResultPageClient } from "@/features/results/components/result-page-client";

export function ResultsIndexClient() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");

  if (reportId) {
    return <ResultPageClient reportId={reportId} />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--color-surface-muted)]">
        <CardTitle className="text-2xl">Aucun rapport selectionne</CardTitle>
        <CardDescription className="mt-2">
          Lancez une analyse pour generer un rapport ATS detaille et visualiser vos resultats.
        </CardDescription>
        <div className="mt-5">
          <Link href="/analyse" className="inline-block">
            <Button>Demarrer une analyse</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}