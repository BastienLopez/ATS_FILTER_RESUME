"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ResultDashboard } from "@/features/results/components/result-dashboard";
import type { AnalysisReport } from "@/types/analysis";

interface ResultPageClientProps {
  reportId: string;
}

interface ReportApiResponse {
  report?: AnalysisReport;
  error?: {
    message?: string;
  };
}

export function ResultPageClient({ reportId }: ResultPageClientProps) {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const storageKey = `ats-report-${reportId}`;
    const cached = sessionStorage.getItem(storageKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AnalysisReport;
        if (mounted && parsed.id === reportId) {
          setReport(parsed);
          setIsLoading(false);
          return;
        }
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }

    async function loadFromApi() {
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        const payload = (await response.json()) as ReportApiResponse;
        if (!response.ok || !payload.report) {
          throw new Error(payload.error?.message ?? "Rapport introuvable ou expire.");
        }
        if (!mounted) {
          return;
        }
        setReport(payload.report);
        sessionStorage.setItem(storageKey, JSON.stringify(payload.report));
      } catch (reason) {
        if (mounted) {
          const message = reason instanceof Error ? reason.message : "Rapport introuvable ou expire.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadFromApi();
    return () => {
      mounted = false;
    };
  }, [reportId]);

  if (isLoading) {
    return (
      <Card>
        <CardTitle>Chargement du rapport</CardTitle>
        <CardDescription className="mt-2">
          Recuperation des resultats ATS. Cette operation prend seulement quelques secondes.
        </CardDescription>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardTitle>Rapport introuvable</CardTitle>
        <CardDescription className="mt-2">
          {error ?? "Ce rapport a peut-etre expire. Relancez une nouvelle analyse pour generer un diagnostic a jour."}
        </CardDescription>
        <Link href="/analyse" className="mt-5 inline-block">
          <Button>Analyser mon CV</Button>
        </Link>
      </Card>
    );
  }

  return <ResultDashboard report={report} />;
}
