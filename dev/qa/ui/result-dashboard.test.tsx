import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultDashboard } from "@/features/results/components/result-dashboard";
import type { AnalysisReport } from "@/types/analysis";

const mockReport: AnalysisReport = {
  id: "report_1",
  createdAt: new Date().toISOString(),
  analysisMode: "with_job",
  input: {
    fileName: "good-cv.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extension: "docx",
    size: 124000,
  },
  summary: {
    verdict: "Forte compatibilite ATS",
    explanation: "Le CV couvre bien les exigences de l'offre.",
    confidenceLevel: 82,
  },
  scores: {
    global: 86,
    atsCompatibility: 84,
    readability: 88,
    matching: 81,
    keywordCoverage: 79,
    structure: 83,
    completeness: 92,
    blockingRequirements: 90,
    experienceQuality: 78,
    contentQuality: 80,
    details: {
      keywordCoverage: { score: 79, weight: 0.35, rationale: "OK" },
      blockingRequirements: { score: 90, weight: 0.2, rationale: "OK" },
      structure: { score: 83, weight: 0.15, rationale: "OK" },
      readability: { score: 88, weight: 0.1, rationale: "OK" },
      experienceQuality: { score: 78, weight: 0.1, rationale: "OK" },
      contentQuality: { score: 80, weight: 0.1, rationale: "OK" },
    },
    penalties: [],
  },
  strengths: ["Bonne couverture des competences"],
  weaknesses: ["Un mot-cle obligatoire manque"],
  matchedKeywords: ["sql", "jira"],
  missingKeywords: ["figma"],
  blockingRequirements: [
    {
      id: "skill-sql",
      type: "skill",
      label: "sql",
      mandatory: true,
      matched: true,
      evidence: "must",
      cvEvidence: "present",
    },
    {
      id: "skill-figma",
      type: "skill",
      label: "figma",
      mandatory: true,
      matched: false,
      evidence: "must",
    },
  ],
  formatRisks: ["Colonnes multiples probables"],
  extractionStats: {
    characterCount: 2400,
    wordCount: 410,
    lineCount: 82,
    denseTextRatio: 0.72,
  },
  recommendations: [
    {
      id: "rec1",
      priority: "haute",
      issue: "Ajouter Figma dans les experiences",
      whyItMatters: "Prerequis obligatoire manquant",
      estimatedImpact: 20,
      howToFix: "Ajouter un exemple concret d'usage",
    },
  ],
  cvTextPreview: "Texte extrait du CV",
  limitations: ["Le score ne garantit pas l'embauche."],
  detectedSections: [
    { key: "experience", label: "Experience", found: true, confidence: 0.8 },
    { key: "skills", label: "Skills", found: true, confidence: 0.8 },
  ],
  contact: {
    fullName: "Alex Martin",
    email: "alex@email.com",
    phone: "+33612345678",
    location: "Paris",
  },
};

describe("ResultDashboard UI", () => {
  it("renders verdict, scores and recommendations", () => {
    render(<ResultDashboard report={mockReport} />);

    expect(screen.getByText(/verdict ats/i)).toBeInTheDocument();
    expect(screen.getByText(/score global/i)).toBeInTheDocument();
    expect(screen.getByText(/86/)).toBeInTheDocument();
    expect(screen.getByText(/ajouter figma/i)).toBeInTheDocument();
    expect(screen.getByText(/risques de format ats/i)).toBeInTheDocument();
  });
});
