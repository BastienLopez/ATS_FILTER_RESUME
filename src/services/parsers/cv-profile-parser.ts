import { ACTION_VERBS, CERTIFICATION_PATTERNS } from "@/content/lexicons";
import { normalizeText, sanitizeExtractedText, toSearchable } from "@/lib/text";
import {
  extractKnownLanguages,
  extractKnownSkills,
  extractKnownTools,
  termMatchesText,
} from "@/services/analysis/keyword-extractor";
import { extractContactInfo } from "@/services/analysis/contact-extractor";
import { detectSections } from "@/services/analysis/section-detector";
import { computeTextExtractionMetrics } from "@/services/parsers/text-metrics";
import type { ParsedCvProfile } from "@/types/analysis";

function extractYearsOfExperience(rawText: string) {
  const nowYear = new Date().getFullYear();
  const rangedYears = Array.from(
    rawText.matchAll(
      /\b(19\d{2}|20\d{2})\s*(?:-|–|—|to|a)\s*(19\d{2}|20\d{2}|present|current|aujourd'hui)\b/gi,
    ),
  ).flatMap((match) => {
    const start = Number(match[1]);
    const endRaw = match[2]?.toLowerCase() ?? "";
    const end = /(present|current|aujourd'hui)/.test(endRaw) ? nowYear : Number(match[2]);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return [];
    }
    return [start, end];
  });

  if (rangedYears.length >= 2) {
    const minYear = Math.min(...rangedYears);
    const maxYear = Math.max(...rangedYears);
    const experienceYears = Math.max(0, maxYear - minYear);
    return experienceYears > 0 && experienceYears < 45 ? experienceYears : undefined;
  }

  const yearMatches = Array.from(rawText.matchAll(/\b(19\d{2}|20\d{2})\b/g)).map((match) => Number(match[1]));
  if (yearMatches.length < 2) {
    return undefined;
  }

  const minYear = Math.min(...yearMatches);
  const maxYear = Math.max(...yearMatches);
  const fallbackYears = Math.max(0, maxYear - minYear);
  return fallbackYears > 0 && fallbackYears < 45 ? fallbackYears : undefined;
}

function extractCertifications(rawText: string) {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .filter((line) => CERTIFICATION_PATTERNS.some((pattern) => pattern.test(line)))
    .slice(0, 8);
}

function enrichSkillsWithSynonyms(rawText: string, skills: string[]) {
  return skills.filter((skill) => termMatchesText(rawText, skill));
}

export function computeContentQualitySignals(rawText: string) {
  const searchable = toSearchable(rawText);
  const actionVerbHits = ACTION_VERBS.filter((verb) => searchable.includes(verb.toLowerCase())).length;
  const quantifiedResults = (rawText.match(/\b\d{1,3}%\b|\b\d+[kK]?\+?\b/g) ?? []).length;
  const bulletLikeLines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]/.test(line)).length;

  return {
    actionVerbHits,
    quantifiedResults,
    bulletLikeLines,
  };
}

export function parseCvProfile(rawText: string): ParsedCvProfile {
  const cleanedRawText = sanitizeExtractedText(rawText);
  const normalizedText = normalizeText(cleanedRawText);
  const sections = detectSections(cleanedRawText);
  const contact = extractContactInfo(cleanedRawText);
  const metrics = computeTextExtractionMetrics(cleanedRawText);

  const extractedSkills = enrichSkillsWithSynonyms(normalizedText, extractKnownSkills(normalizedText));
  const extractedTools = extractKnownTools(normalizedText);
  const languages = extractKnownLanguages(normalizedText);
  const certifications = extractCertifications(normalizedText);
  const experienceYears = extractYearsOfExperience(normalizedText);

  return {
    normalizedText,
    rawText: cleanedRawText,
    contact,
    sections,
    extractedSkills,
    extractedTools,
    languages,
    certifications,
    experienceYears,
    metrics,
  };
}
