import type { Metadata } from "next";
import { ResultPageClient } from "@/features/results/components/result-page-client";

export const metadata: Metadata = {
  title: "Resultat ATS | ATS Filter Resume",
  description: "Rapport ATS detaille: score global, sous-scores et recommandations prioritaires.",
};

interface ResultsPageProps {
  params: Promise<{ reportId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { reportId } = await params;
  return <ResultPageClient reportId={reportId} />;
}
