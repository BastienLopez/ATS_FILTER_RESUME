import { describe, expect, it } from "vitest";
import { computeScores } from "@/services/analysis/scoring";
import type { ParsedCvProfile, ParsedJobDescription } from "@/types/analysis";
import type { MatchingResult } from "@/services/analysis/matching";

function buildBaseCv(overrides: Partial<ParsedCvProfile> = {}): ParsedCvProfile {
  return {
    normalizedText: "base",
    rawText: "base cv text",
    contact: {
      fullName: "Alex Martin",
      email: "alex@email.com",
      phone: "+33612345678",
      location: "Paris",
    },
    sections: [
      { key: "contact", label: "Contact", found: true, confidence: 1 },
      { key: "title", label: "Title", found: true, confidence: 0.9 },
      { key: "summary", label: "Summary", found: true, confidence: 0.9 },
      { key: "experience", label: "Experience", found: true, confidence: 0.9 },
      { key: "education", label: "Education", found: true, confidence: 0.8 },
      { key: "skills", label: "Skills", found: true, confidence: 0.9 },
    ],
    extractedSkills: ["sql", "jira"],
    extractedTools: ["jira"],
    languages: ["anglais"],
    certifications: ["PSM I"],
    experienceYears: 6,
    metrics: {
      hasExtractableText: true,
      characterCount: 2400,
      lineCount: 70,
      wordCount: 420,
      denseTextRatio: 0.72,
      probableImageOnly: false,
      riskyFormatIndicators: [],
    },
    ...overrides,
  };
}

function buildBaseJob(overrides: Partial<ParsedJobDescription> = {}): ParsedJobDescription {
  return {
    title: "Product Owner Senior",
    seniority: "senior",
    hardSkills: ["sql"],
    tools: ["jira"],
    softSkills: [],
    mandatoryRequirements: [],
    preferredRequirements: [],
    yearsOfExperience: 5,
    languages: ["anglais"],
    ...overrides,
  };
}

function buildMatching(overrides: Partial<MatchingResult> = {}): MatchingResult {
  return {
    requiredKeywords: ["sql", "jira", "anglais"],
    matchedKeywords: ["sql", "jira", "anglais"],
    missingKeywords: [],
    titleMatch: true,
    seniorityMatch: true,
    requirementMatches: [],
    mandatoryMissing: [],
    mandatoryMatched: [],
    coverageRatio: 1,
    ...overrides,
  };
}

describe("scoring", () => {
  it("computes strong score for well-matched profile", () => {
    const scores = computeScores({
      cv: buildBaseCv(),
      job: buildBaseJob(),
      matching: buildMatching(),
      contentSignals: { actionVerbHits: 6, quantifiedResults: 4, bulletLikeLines: 10 },
    });

    expect(scores.global).toBeGreaterThanOrEqual(80);
    expect(scores.keywordCoverage).toBe(100);
    expect(scores.penalties).toHaveLength(0);
  });

  it("applies penalties for missing contacts and low coverage", () => {
    const scores = computeScores({
      cv: buildBaseCv({
        contact: { fullName: "Alex Martin" },
        metrics: {
          hasExtractableText: false,
          characterCount: 120,
          lineCount: 12,
          wordCount: 24,
          denseTextRatio: 0.3,
          probableImageOnly: true,
          riskyFormatIndicators: ["Colonnes multiples probables", "Tableaux potentiellement complexes"],
        },
      }),
      job: buildBaseJob({
        mandatoryRequirements: [
          {
            id: "skill-sql",
            type: "skill",
            label: "sql",
            mandatory: true,
            matched: false,
            evidence: "must",
          },
        ],
      }),
      matching: buildMatching({
        coverageRatio: 0.2,
        matchedKeywords: ["sql"],
        missingKeywords: ["jira", "anglais"],
        mandatoryMissing: [
          {
            id: "skill-sql",
            type: "skill",
            label: "sql",
            mandatory: true,
            matched: false,
            evidence: "must",
          },
        ],
      }),
      contentSignals: { actionVerbHits: 0, quantifiedResults: 0, bulletLikeLines: 0 },
    });

    expect(scores.global).toBeLessThan(40);
    expect(scores.penalties.length).toBeGreaterThanOrEqual(3);
    expect(scores.penalties.some((penalty) => penalty.code === "missing_email")).toBe(true);
  });
});
