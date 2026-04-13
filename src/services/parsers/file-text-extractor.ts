import { sanitizeExtractedText } from "@/lib/text";
import { parseDocxBuffer } from "@/services/parsers/docx-parser";
import { parsePdfBuffer } from "@/services/parsers/pdf-parser";
import { computeTextExtractionMetrics } from "@/services/parsers/text-metrics";
import type { SupportedFileExtension } from "@/types/analysis";

interface FileExtractionResult {
  rawText: string;
  metrics: ReturnType<typeof computeTextExtractionMetrics>;
  warnings: string[];
}

export async function extractTextFromFile(
  file: File,
  extension: SupportedFileExtension,
): Promise<FileExtractionResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  let rawText = "";

  if (extension === "pdf") {
    rawText = await parsePdfBuffer(buffer);
  } else {
    rawText = await parseDocxBuffer(buffer);
  }

  rawText = sanitizeExtractedText(rawText);

  const metrics = computeTextExtractionMetrics(rawText);
  const warnings: string[] = [];

  if (!metrics.hasExtractableText) {
    warnings.push("Le texte du CV est partiellement extractible. Evitez les scans image ou les exports non textuels.");
  }

  if (metrics.riskyFormatIndicators.length > 0) {
    warnings.push("Le format contient des elements a risque pour certains ATS (colonnes, tableaux, pictogrammes).");
  }

  return {
    rawText,
    metrics,
    warnings,
  };
}
