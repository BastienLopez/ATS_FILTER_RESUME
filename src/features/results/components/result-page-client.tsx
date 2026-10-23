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

    async function loadReport(): Promise<{ report: AnalysisReport; fromCache: boolean } | null> {
      const cached = sessionStorage.getItem(storageKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached) as AnalysisReport;
          if (parsed.id === reportId) {
            return { report: parsed, fromCache: true };
          }
        } catch {
          sessionStorage.removeItem(storageKey);
        }
      }

      const response = await fetch(`/api/reports/${reportId}`);
      const payload = (await response.json()) as ReportApiResponse;
      if (!response.ok || !payload.report) {
        throw new Error(payload.error?.message ?? "Rapport introuvable ou expire.");
      }
      if (!mounted) {
        return null;
      }
      return { report: payload.report, fromCache: false };
    }

    void loadReport()
      .then((loadedReport) => {
        if (!mounted || !loadedReport) {
          return;
        }
        setReport(loadedReport.report);
        if (!loadedReport.fromCache) {
          sessionStorage.setItem(storageKey, JSON.stringify(loadedReport.report));
        }
        setIsLoading(false);
      })
      .catch((reason: unknown) => {
        if (!mounted) {
          return;
        }
        const message = reason instanceof Error ? reason.message : "Rapport introuvable ou expire.";
        setError(message);
        setIsLoading(false);
      });

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
