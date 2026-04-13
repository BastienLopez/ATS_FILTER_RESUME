import { nanoid } from "nanoid";
import { toUniqueSorted } from "@/lib/utils";
import { buildMatchingResult } from "@/services/analysis/matching";
import { generateRecommendations } from "@/services/analysis/recommendations";
import { computeScores } from "@/services/analysis/scoring";
import { buildExecutiveExplanation, computeConfidenceLevel, resolveVerdict } from "@/services/analysis/verdict";
import { computeContentQualitySignals, parseCvProfile } from "@/services/parsers/cv-profile-parser";
import { parseJobDescription } from "@/services/parsers/job-parser";
import type { AnalysisReport, UploadMetadata } from "@/types/analysis";

interface AnalyzeInput {
  upload: UploadMetadata;
  cvText: string;
  jobDescription: string;
  extractionWarnings?: string[];
}

function buildStrengths(report: {
  analysisMode: AnalysisReport["analysisMode"];
  scores: ReturnType<typeof computeScores>;
  matchedKeywords: string[];
  mandatoryMatchedCount: number;
  hasContact: boolean;
}) {
  const strengths: string[] = [];

  if (report.analysisMode === "with_job" && report.scores.keywordCoverage >= 65) {
    strengths.push("Bonne couverture des competences cles de l'offre.");
  }
  if (report.mandatoryMatchedCount > 0) {
    strengths.push("Plusieurs pre-requis obligatoires sont bien couverts.");
  }
  if (report.scores.structure >= 70) {
    strengths.push("Structure du CV lisible et globalement standard pour ATS.");
  }
  if (report.hasContact) {
    strengths.push("Coordonnees principales detectees correctement.");
  }
  if (report.analysisMode === "ats_only" && report.matchedKeywords.length >= 6) {
    strengths.push("Le CV contient deja un socle de competences explicites lisibles par ATS.");
  }
  if (report.analysisMode === "with_job" && report.matchedKeywords.length >= 8) {
    strengths.push("Volume de mots-cles metier satisfaisant.");
  }

  return strengths.slice(0, 6);
}

function buildWeaknesses(
  analysisMode: AnalysisReport["analysisMode"],
  matching: ReturnType<typeof buildMatchingResult>,
  scores: ReturnType<typeof computeScores>,
  missingKeywords: string[],
) {
  const weaknesses = scores.penalties.map((penalty) => penalty.reason);

  if (analysisMode === "with_job" && missingKeywords.length >= 5) {
    weaknesses.push("Plusieurs mots-cles demandes dans l'offre restent absents du CV.");
  }
  if (scores.experienceQuality < 50) {
    weaknesses.push("Les experiences manquent d'indicateurs de resultats concrets.");
  }
  if (analysisMode === "with_job" && !matching.titleMatch) {
    weaknesses.push("L'intitule du CV est peu aligne avec le poste vise.");
  }
  if (analysisMode === "with_job" && !matching.seniorityMatch) {
    weaknesses.push("La seniorite percue peut etre en decalage avec le niveau demande.");
  }

  return Array.from(new Set(weaknesses)).slice(0, 8);
}

function defaultLimitations(analysisMode: AnalysisReport["analysisMode"]) {
  const base = [
    "Cette estimation ATS est probabiliste et ne garantit ni entretien ni embauche.",
    "Les ATS varient selon les entreprises: regles et ponderations peuvent differer.",
    "Le matching s'appuie sur le texte extrait: un PDF scanne ou mal exporte reduit la fiabilite.",
    "Les elements contextuels non textuels (design, recommandations humaines) ne sont pas evalues.",
  ];

  if (analysisMode === "ats_only") {
    base.push("Sans offre ciblee, l'analyse se concentre surtout sur la qualite ATS generale du CV.");
  }

  return base;
}

export function runAtsAnalysis({
  upload,
  cvText,
  jobDescription,
  extractionWarnings = [],
}: AnalyzeInput): AnalysisReport {
  const normalizedJobDescription = jobDescription.trim();
  const analysisMode: AnalysisReport["analysisMode"] =
    normalizedJobDescription.length > 0 ? "with_job" : "ats_only";

  const cv = parseCvProfile(cvText);
  const job = parseJobDescription(normalizedJobDescription);
  const matching = buildMatchingResult(cv, job);
  const contentSignals = computeContentQualitySignals(cv.rawText);
  const scores = computeScores({ cv, job, matching, contentSignals });
  const recommendations = generateRecommendations({ analysisMode, cv, job, matching, scores });

  const verdict = resolveVerdict(scores.global);
  const confidenceLevel = computeConfidenceLevel(scores, cv.metrics.riskyFormatIndicators.length);
  const explanation = buildExecutiveExplanation(scores, analysisMode);

  const profileKeywords = toUniqueSorted([...cv.extractedSkills, ...cv.extractedTools, ...cv.languages]).slice(0, 20);
  const matchedKeywords = analysisMode === "ats_only" ? profileKeywords : matching.matchedKeywords;
  const missingKeywords = analysisMode === "ats_only" ? [] : matching.missingKeywords;

  const strengths = buildStrengths({
    analysisMode,
    scores,
    matchedKeywords,
    mandatoryMatchedCount: matching.mandatoryMatched.length,
    hasContact: Boolean(cv.contact.email && cv.contact.phone),
  });
  const weaknesses = buildWeaknesses(analysisMode, matching, scores, missingKeywords);

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    analysisMode,
    input: upload,
    summary: {
      verdict,
      explanation,
      confidenceLevel,
    },
    scores,
    strengths,
    weaknesses,
    matchedKeywords,
    missingKeywords,
    blockingRequirements: analysisMode === "ats_only" ? [] : matching.requirementMatches,
    formatRisks: [...cv.metrics.riskyFormatIndicators, ...extractionWarnings],
    extractionStats: {
      characterCount: cv.metrics.characterCount,
      wordCount: cv.metrics.wordCount,
      lineCount: cv.metrics.lineCount,
      denseTextRatio: cv.metrics.denseTextRatio,
    },
    recommendations,
    cvTextPreview: cv.rawText,
    limitations: defaultLimitations(analysisMode),
    detectedSections: cv.sections,
    contact: cv.contact,
  };
}
