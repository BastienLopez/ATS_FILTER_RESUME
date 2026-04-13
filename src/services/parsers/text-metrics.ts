import { RISKY_FORMAT_PATTERNS } from "@/content/lexicons";
import { normalizeText } from "@/lib/text";
import type { TextExtractionMetrics } from "@/types/analysis";

export function computeTextExtractionMetrics(input: string): TextExtractionMetrics {
  const normalized = normalizeText(input);
  const lineCount = normalized.length > 0 ? normalized.split("\n").length : 0;
  const words = normalized.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = normalized.length;

  const alphaNumericChars = normalized.replace(/[^a-zA-Z0-9]/g, "").length;
  const denseTextRatio = characterCount > 0 ? alphaNumericChars / characterCount : 0;

  const riskyFormatIndicators = RISKY_FORMAT_PATTERNS.filter((rule) => rule.pattern.test(normalized)).map(
    (rule) => rule.label,
  );

  const hasExtractableText = characterCount >= 120 && wordCount >= 35;
  const probableImageOnly = !hasExtractableText || denseTextRatio < 0.45;

  return {
    hasExtractableText,
    characterCount,
    lineCount,
    wordCount,
    denseTextRatio: Number(denseTextRatio.toFixed(3)),
    probableImageOnly,
    riskyFormatIndicators,
  };
}
