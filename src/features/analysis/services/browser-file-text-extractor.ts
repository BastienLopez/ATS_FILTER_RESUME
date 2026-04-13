import mammoth from "mammoth/mammoth.browser";
import { sanitizeExtractedText } from "@/lib/text";
import { computeTextExtractionMetrics } from "@/services/parsers/text-metrics";
import type { SupportedFileExtension } from "@/types/analysis";

interface BrowserFileExtractionResult {
  rawText: string;
  metrics: ReturnType<typeof computeTextExtractionMetrics>;
  warnings: string[];
}

async function parsePdfInBrowser(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).toString();

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const document = await loadingTask.promise;

  try {
    const pages: string[] = [];
    for (let pageIndex = 1; pageIndex <= document.numPages; pageIndex += 1) {
      const page = await document.getPage(pageIndex);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => {
          if (typeof item === "object" && item && "str" in item) {
            return String(item.str ?? "");
          }
          return "";
        })
        .join(" ");
      pages.push(pageText);
    }
    return pages.join("\n");
  } finally {
    await document.destroy();
  }
}

async function parseDocxInBrowser(arrayBuffer: ArrayBuffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value ?? "";
}

export async function extractTextFromFileInBrowser(
  file: File,
  extension: SupportedFileExtension,
): Promise<BrowserFileExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const rawText =
    extension === "pdf" ? await parsePdfInBrowser(arrayBuffer) : await parseDocxInBrowser(arrayBuffer);

  const sanitizedText = sanitizeExtractedText(rawText);
  const metrics = computeTextExtractionMetrics(sanitizedText);
  const warnings: string[] = [];

  if (!metrics.hasExtractableText) {
    warnings.push("Le texte du CV est partiellement extractible. Evitez les scans image ou les exports non textuels.");
  }

  if (metrics.riskyFormatIndicators.length > 0) {
    warnings.push("Le format contient des elements a risque pour certains ATS (colonnes, tableaux, pictogrammes).");
  }

  return {
    rawText: sanitizedText,
    metrics,
    warnings,
  };
}