"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListChecks, Sparkles, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DEFAULT_JOB_EXAMPLE_ID, JOB_DESCRIPTION_EXAMPLES } from "@/content/job-examples";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CvDropzone } from "@/features/analysis/components/cv-dropzone";
import type { AnalysisReport } from "@/types/analysis";

const optionalJobDescriptionSchema = z
  .string()
  .max(15_000, "L'offre depasse la taille maximale autorisee.")
  .transform((value) => value.trim())
  .refine((value) => value.length === 0 || value.length >= 80, {
    message: "L'offre semble trop courte. Ajoutez plus de details ou laissez vide pour une analyse ATS generale.",
  });

const formSchema = z.object({
  jobDescription: optionalJobDescriptionSchema,
});

type FormValues = z.infer<typeof formSchema>;

interface ApiErrorPayload {
  error?: {
    message?: string;
  };
}

interface AnalyzeSuccessResponse {
  reportId: string;
  report: AnalysisReport;
}

export function AnalysisForm() {
  const router = useRouter();
  const serverAnalysisDisabled = process.env.NEXT_PUBLIC_DISABLE_SERVER_ANALYSIS === "true";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExampleId, setSelectedExampleId] = useState(DEFAULT_JOB_EXAMPLE_ID);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { jobDescription: "" },
    mode: "onBlur",
  });

  const currentJobDescription = form.watch("jobDescription");

  const selectedExample = useMemo(
    () => JOB_DESCRIPTION_EXAMPLES.find((item) => item.id === selectedExampleId) ?? JOB_DESCRIPTION_EXAMPLES[0],
    [selectedExampleId],
  );

  const applyExample = () => {
    if (!selectedExample) {
      return;
    }
    form.setValue("jobDescription", selectedExample.description, { shouldValidate: true, shouldDirty: true });
  };

  const enableAtsOnlyMode = () => {
    form.setValue("jobDescription", "", { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setApiError(null);

    if (serverAnalysisDisabled) {
      setApiError("L'analyse serveur est desactivee sur la version GitHub Pages statique.");
      return;
    }

    if (!selectedFile) {
      setFileError("Selectionnez un CV PDF ou DOCX valide avant de lancer l'analyse.");
      return;
    }

    setFileError(null);
    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append("cv", selectedFile);
      body.append("jobDescription", values.jobDescription ?? "");

      const response = await fetch("/api/analyze", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as Partial<AnalyzeSuccessResponse> & ApiErrorPayload;
      if (!response.ok || !payload.reportId || !payload.report) {
        setApiError(payload.error?.message ?? "Impossible de lancer l'analyse pour le moment.");
        return;
      }

      sessionStorage.setItem(`ats-report-${payload.reportId}`, JSON.stringify(payload.report));
      router.push(`/resultats/${payload.reportId}`);
    } catch {
      setApiError("Erreur reseau temporaire. Verifiez votre connexion puis relancez.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="space-y-6 shadow-none">
      <div>
        <CardTitle>Lancer l&apos;analyse ATS</CardTitle>
        <CardDescription className="mt-2">
          Importez votre CV puis ajoutez une offre ciblee si vous en avez une. Sans offre, vous obtenez une analyse
          ATS generale (lisibilite, structure, completude, risques de rejet).
        </CardDescription>
      </div>

      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <div>
          <p className="mb-2 text-sm font-bold text-[var(--color-ink)]">1) CV (PDF ou DOCX)</p>
          <CvDropzone
            file={selectedFile}
            onFileChange={(file) => {
              setSelectedFile(file);
              if (file) {
                setFileError(null);
              }
            }}
            onInvalidFile={() => setFileError("Format invalide. Importez un PDF ou DOCX de taille raisonnable.")}
            error={fileError ?? undefined}
          />
        </div>

        <div className="space-y-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-[var(--color-ink)]">2) Offre d&apos;emploi (optionnel)</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={applyExample}>
                <Sparkles className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
                Inserer un exemple
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={enableAtsOnlyMode}>
                <ListChecks className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
                Mode ATS seul
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <label htmlFor="job-example" className="sr-only">
              Choisir un exemple d&apos;offre
            </label>
            <select
              id="job-example"
              value={selectedExampleId}
              onChange={(event) => setSelectedExampleId(event.target.value)}
              className="h-11 rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-semibold text-[var(--color-ink)] shadow-hard-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {JOB_DESCRIPTION_EXAMPLES.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.title}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" size="md" onClick={applyExample}>
              Charger l&apos;exemple
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {JOB_DESCRIPTION_EXAMPLES.slice(0, 10).map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => {
                  setSelectedExampleId(example.id);
                  form.setValue("jobDescription", example.description, { shouldValidate: true, shouldDirty: true });
                }}
                className="rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-bold text-[var(--color-border)] transition hover:-translate-y-0.5 hover:bg-[var(--color-surface)]"
              >
                {example.title}
              </button>
            ))}
          </div>

          <Textarea
            {...form.register("jobDescription")}
            aria-invalid={Boolean(form.formState.errors.jobDescription)}
            aria-describedby={form.formState.errors.jobDescription ? "job-error" : "job-help"}
            placeholder="Collez l'offre complete (optionnel). Vous pouvez laisser vide pour verifier uniquement la compatibilite ATS generale de votre CV."
          />

          {form.formState.errors.jobDescription ? (
            <p id="job-error" className="mt-2 text-sm font-semibold text-red-700">
              {form.formState.errors.jobDescription.message}
            </p>
          ) : (
            <p id="job-help" className="mt-2 text-xs text-[var(--color-muted)]">
              {currentJobDescription.length === 0
                ? "Aucune offre fournie: analyse ATS generale activee."
                : "Offre detectee: le rapport inclura la correspondance metier et les prerequis bloquants."}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={serverAnalysisDisabled}
          className="w-full sm:w-auto"
        >
          {serverAnalysisDisabled ? "Analyse indisponible sur GitHub Pages" : "Analyser mon CV"}
        </Button>
      </form>

      {serverAnalysisDisabled ? (
        <Alert
          title="Mode statique GitHub Pages"
          variant="info"
          description="Le deploy GitHub Pages publie une version statique de presentation. Utilisez l'execution serveur pour lancer une analyse complete."
        />
      ) : null}

      {isSubmitting ? (
        <Alert
          title="Analyse en cours"
          variant="info"
          description="Extraction du CV, scoring ATS et generation des recommandations..."
        />
      ) : null}

      {apiError ? (
        <Alert
          title="Analyse impossible"
          variant="danger"
          description={
            <span className="inline-flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4" aria-hidden="true" suppressHydrationWarning />
              {apiError}
            </span>
          }
        />
      ) : null}
    </Card>
  );
}

