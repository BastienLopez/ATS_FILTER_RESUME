import { inferExtension, fileSchema } from "@/lib/validators/analyze-request";
import { runAtsAnalysis } from "@/services/analysis/ats-analyzer";
import { extractTextFromFileInBrowser } from "@/features/analysis/services/browser-file-text-extractor";
import type { AnalysisReport } from "@/types/analysis";

interface ClientAnalysisResult {
  reportId: string;
  report: AnalysisReport;
}

interface ClientAnalysisInput {
  file: File;
  jobDescription: string;
}

export async function runClientSideAnalysis({ file, jobDescription }: ClientAnalysisInput): Promise<ClientAnalysisResult> {
  const parsedFile = fileSchema.safeParse({
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (!parsedFile.success) {
    throw new Error(parsedFile.error.issues[0]?.message ?? "Fichier invalide.");
  }

  const extension = inferExtension(file.name);
  if (!extension) {
    throw new Error("Extension non supportee. Utilisez .pdf ou .docx.");
  }

  let extraction;
  try {
    extraction = await extractTextFromFileInBrowser(file, extension);
  } catch {
    throw new Error("Impossible d'extraire le texte du CV. Essayez un PDF texte ou un DOCX natif.");
  }

  if (extraction.metrics.wordCount < 20) {
    throw new Error("Le CV semble vide ou trop court apres extraction.");
  }

  const report = runAtsAnalysis({
    upload: {
      fileName: file.name,
      mimeType: file.type,
      extension,
      size: file.size,
    },
    cvText: extraction.rawText,
    jobDescription,
    extractionWarnings: extraction.warnings,
  });

  return {
    reportId: report.id,
    report,
  };
}