import { SECTION_PATTERNS } from "@/content/lexicons";
import { toSearchable } from "@/lib/text";
import type { SectionDetection } from "@/types/analysis";

const HEADING_REGEX = /^[\p{L}][\p{L}\s\-/:]{2,}$/u;

export function detectSections(rawText: string): SectionDetection[] {
  const searchable = toSearchable(rawText);
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return Object.entries(SECTION_PATTERNS).map(([key, definition]) => {
    let confidence = 0;
    let evidence: string | undefined;

    for (const pattern of definition.patterns) {
      const match = rawText.match(pattern);
      if (match) {
        confidence = Math.max(confidence, 0.9);
        evidence = match[0];
      }

      if (pattern.test(searchable)) {
        confidence = Math.max(confidence, 0.75);
      }
    }

    if (confidence < 0.7) {
      const heading = lines.find((line) => HEADING_REGEX.test(line) && definition.patterns.some((p) => p.test(line)));
      if (heading) {
        confidence = 0.7;
        evidence = heading;
      }
    }

    return {
      key,
      label: definition.label,
      found: confidence > 0,
      confidence,
      evidence,
    };
  });
}
