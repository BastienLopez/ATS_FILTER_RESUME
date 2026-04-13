import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/config";
import { analyzePayloadSchema, fileSchema, inferExtension } from "@/lib/validators/analyze-request";
import { runAtsAnalysis } from "@/services/analysis/ats-analyzer";
import { extractTextFromFile } from "@/services/parsers/file-text-extractor";
import { saveReport } from "@/services/reports/temp-report-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorCode =
  | "INVALID_FORM"
  | "INVALID_FILE"
  | "PARSING_FAILED"
  | "EMPTY_DOCUMENT"
  | "INTERNAL_ERROR";

function errorResponse(status: number, code: ErrorCode, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv");
    const rawJobDescription = formData.get("jobDescription");
    const jobDescription = typeof rawJobDescription === "string" ? rawJobDescription : "";

    if (!(file instanceof File)) {
      return errorResponse(
        400,
        "INVALID_FORM",
        "Formulaire invalide. Ajoutez un CV (PDF/DOCX) pour lancer l'analyse.",
      );
    }

    const payloadValidation = analyzePayloadSchema.safeParse({ jobDescription });
    if (!payloadValidation.success) {
      return errorResponse(422, "INVALID_FORM", payloadValidation.error.issues[0]?.message ?? "Offre invalide.");
    }

    const parsedFile = fileSchema.safeParse({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!parsedFile.success) {
      return errorResponse(422, "INVALID_FILE", parsedFile.error.issues[0]?.message ?? "Fichier invalide.");
    }

    const extension = inferExtension(file.name);
    if (!extension) {
      return errorResponse(422, "INVALID_FILE", "Extension non supportee. Utilisez .pdf ou .docx.");
    }

    let extraction;
    try {
      extraction = await extractTextFromFile(file, extension);
    } catch {
      return errorResponse(
        422,
        "PARSING_FAILED",
        "Impossible d'extraire le texte du CV. Essayez un PDF texte ou un DOCX natif.",
      );
    }

    if (extraction.metrics.wordCount < 20) {
      return errorResponse(422, "EMPTY_DOCUMENT", "Le CV semble vide ou trop court apres extraction.");
    }

    const report = runAtsAnalysis({
      upload: {
        fileName: file.name,
        mimeType: file.type,
        extension,
        size: file.size,
      },
      cvText: extraction.rawText,
      jobDescription: payloadValidation.data.jobDescription,
      extractionWarnings: extraction.warnings,
    });

    const reportId = saveReport(report);

    return NextResponse.json(
      {
        reportId,
        createdAt: report.createdAt,
        expiresInMinutes: APP_CONFIG.reportTtlMinutes,
        report,
      },
      { status: 200 },
    );
  } catch {
    return errorResponse(500, "INTERNAL_ERROR", "Echec serveur temporaire. Reessayez dans quelques secondes.");
  }
}
