import { clamp, round } from "@/lib/utils";
import type { MatchingResult } from "@/services/analysis/matching";
import type { AnalysisPenalty, AnalysisScores, ParsedCvProfile, ParsedJobDescription } from "@/types/analysis";

export interface ContentSignals {
  actionVerbHits: number;
  quantifiedResults: number;
  bulletLikeLines: number;
}

interface ScoreInput {
  cv: ParsedCvProfile;
  job: ParsedJobDescription;
  matching: MatchingResult;
  contentSignals: ContentSignals;
}

function hasJobContext(job: ParsedJobDescription) {
  return Boolean(
    job.title ||
      job.seniority ||
      job.hardSkills.length > 0 ||
      job.tools.length > 0 ||
      job.languages.length > 0 ||
      job.mandatoryRequirements.length > 0 ||
      job.preferredRequirements.length > 0,
  );
}

function getStructureScore(cv: ParsedCvProfile) {
  const requiredSections = ["contact", "title", "summary", "experience", "education", "skills"];
  const found = requiredSections.filter((key) => cv.sections.some((section) => section.key === key && section.found));
  return round((found.length / requiredSections.length) * 100);
}

function getReadabilityScore(cv: ParsedCvProfile) {
  const { metrics } = cv;
  let score = 100;

  if (!metrics.hasExtractableText) {
    score -= 40;
  }
  if (metrics.probableImageOnly) {
    score -= 25;
  }
  if (metrics.riskyFormatIndicators.length > 0) {
    score -= metrics.riskyFormatIndicators.length * 6;
  }
  if (metrics.wordCount < 180) {
    score -= 12;
  }
  if (metrics.lineCount < 20) {
    score -= 8;
  }
  if (metrics.denseTextRatio < 0.5) {
    score -= 10;
  }

  return clamp(round(score));
}

function getCompletenessScore(cv: ParsedCvProfile) {
  let score = 100;
  if (!cv.contact.fullName) {
    score -= 8;
  }
  if (!cv.contact.email) {
    score -= 20;
  }
  if (!cv.contact.phone) {
    score -= 15;
  }
  if (!cv.contact.location) {
    score -= 5;
  }
  if (!cv.sections.some((section) => section.key === "experience" && section.found)) {
    score -= 20;
  }
  if (!cv.sections.some((section) => section.key === "education" && section.found)) {
    score -= 10;
  }
  if (!cv.sections.some((section) => section.key === "skills" && section.found)) {
    score -= 15;
  }
  return clamp(round(score));
}

function getExperienceQualityScore(contentSignals: ContentSignals) {
  const { actionVerbHits, quantifiedResults } = contentSignals;
  const actionScore = Math.min(actionVerbHits * 8, 45);
  const quantifiedScore = Math.min(quantifiedResults * 12, 45);
  const base = 10;
  return clamp(round(base + actionScore + quantifiedScore));
}

function getContentQualityScore(cv: ParsedCvProfile, contentSignals: ContentSignals) {
  const richnessScore = Math.min(cv.metrics.wordCount / 6, 50);
  const structureBonus = cv.sections.filter((section) => section.found).length * 4;
  const bulletBonus = Math.min(contentSignals.bulletLikeLines * 2, 12);
  return clamp(round(richnessScore + structureBonus + bulletBonus));
}

function getAtsOnlyKeywordScore(cv: ParsedCvProfile) {
  const skillsSignal = cv.extractedSkills.length * 7;
  const toolsSignal = cv.extractedTools.length * 5;
  const languageSignal = cv.languages.length * 10;
  const richnessSignal = cv.metrics.wordCount >= 300 ? 20 : cv.metrics.wordCount >= 180 ? 10 : 0;
  const total = skillsSignal + toolsSignal + languageSignal + richnessSignal;
  return clamp(round(Math.max(25, total)));
}

function buildPenalties(
  cv: ParsedCvProfile,
  job: ParsedJobDescription,
  matching: MatchingResult,
  keywordCoverageScore: number,
  structureScore: number,
  jobContextEnabled: boolean,
): AnalysisPenalty[] {
  const penalties: AnalysisPenalty[] = [];

  if (!cv.metrics.hasExtractableText) {
    penalties.push({
      code: "text_non_extractible",
      label: "Texte difficilement extractible",
      points: 35,
      reason: "Le CV ressemble a un scan image ou a un format non lisible par ATS.",
    });
  }

  if (!cv.contact.email) {
    penalties.push({
      code: "missing_email",
      label: "Email absent",
      points: 10,
      reason: "Les ATS et recruteurs ne trouvent pas d'adresse email fiable.",
    });
  }

  if (!cv.contact.phone) {
    penalties.push({
      code: "missing_phone",
      label: "Telephone absent",
      points: 8,
      reason: "Le numero de telephone manque pour le contact rapide.",
    });
  }

  if (jobContextEnabled && matching.mandatoryMissing.length > 0) {
    penalties.push({
      code: "missing_mandatory_requirements",
      label: "Pre-requis obligatoires non couverts",
      points: Math.min(40, matching.mandatoryMissing.length * 12),
      reason: "Au moins une exigence obligatoire de l'offre n'est pas retrouvee dans le CV.",
    });
  }

  if (cv.metrics.riskyFormatIndicators.length >= 2) {
    penalties.push({
      code: "complex_layout",
      label: "Structure visuelle a risque",
      points: 12,
      reason: "Colonnes, tableaux ou symboles decoratifs peuvent degrader le parsing ATS.",
    });
  }

  if (jobContextEnabled && keywordCoverageScore < 35) {
    penalties.push({
      code: "low_match",
      label: "Correspondance faible avec l'offre",
      points: 14,
      reason: "Peu de mots-cles strategiques de l'offre sont presents dans le CV.",
    });
  }

  if (structureScore < 45) {
    penalties.push({
      code: "missing_sections",
      label: "Sections critiques manquantes",
      points: 10,
      reason: "Le CV ne suit pas un squelette standard attendu par les ATS.",
    });
  }

  if (jobContextEnabled && job.title && !matching.titleMatch) {
    penalties.push({
      code: "title_mismatch",
      label: "Intitule de poste peu aligne",
      points: 8,
      reason: "Le titre cible de l'offre est peu visible dans l'en-tete du CV.",
    });
  }

  if (jobContextEnabled && job.seniority && !matching.seniorityMatch) {
    penalties.push({
      code: "seniority_mismatch",
      label: "Seniority potentiellement incoherente",
      points: 10,
      reason: "Le niveau d'experience du CV semble en decalage avec la seniorite demandee.",
    });
  }

  if (
    jobContextEnabled &&
    typeof job.yearsOfExperience === "number" &&
    typeof cv.experienceYears === "number" &&
    cv.experienceYears + 1 < job.yearsOfExperience
  ) {
    penalties.push({
      code: "years_experience_gap",
      label: "Ecart sur les annees d'experience",
      points: 12,
      reason: "Le volume d'experience estime dans le CV est inferieur au minimum attendu.",
    });
  }

  return penalties;
}

export function computeScores({ cv, job, matching, contentSignals }: ScoreInput): AnalysisScores {
  const jobContextEnabled = hasJobContext(job);
  const structureScore = getStructureScore(cv);
  const readabilityScore = getReadabilityScore(cv);
  const completenessScore = getCompletenessScore(cv);
  const experienceQualityScore = getExperienceQualityScore(contentSignals);
  const contentQualityScore = getContentQualityScore(cv, contentSignals);

  const keywordCoverageScore = jobContextEnabled ? round(matching.coverageRatio * 100) : getAtsOnlyKeywordScore(cv);
  const blockingRequirementsScore = jobContextEnabled
    ? job.mandatoryRequirements.length === 0
      ? 100
      : round((matching.mandatoryMatched.length / job.mandatoryRequirements.length) * 100)
    : 100;

  const requirementCoverageScore = jobContextEnabled
    ? matching.requirementMatches.length === 0
      ? 100
      : round(
          (matching.requirementMatches.filter((requirement) => requirement.matched).length / matching.requirementMatches.length) *
            100,
        )
    : 100;

  const matchingScore = jobContextEnabled
    ? clamp(
        round(
          keywordCoverageScore * 0.55 +
            requirementCoverageScore * 0.25 +
            (matching.titleMatch ? 10 : 0) +
            (matching.seniorityMatch ? 10 : 0),
        ),
      )
    : clamp(round(keywordCoverageScore * 0.4 + structureScore * 0.35 + readabilityScore * 0.25));

  const penalties = buildPenalties(cv, job, matching, keywordCoverageScore, structureScore, jobContextEnabled);
  const baseGlobalScore = round(
    keywordCoverageScore * 0.35 +
      blockingRequirementsScore * 0.2 +
      structureScore * 0.15 +
      readabilityScore * 0.1 +
      experienceQualityScore * 0.1 +
      contentQualityScore * 0.1,
  );
  const penaltyPoints = penalties.reduce((sum, penalty) => sum + penalty.points, 0);
  const globalScore = clamp(baseGlobalScore - penaltyPoints);

  const atsCompatibility = clamp(round(structureScore * 0.35 + readabilityScore * 0.25 + blockingRequirementsScore * 0.4));

  return {
    global: globalScore,
    atsCompatibility,
    readability: readabilityScore,
    matching: matchingScore,
    keywordCoverage: keywordCoverageScore,
    structure: structureScore,
    completeness: completenessScore,
    blockingRequirements: blockingRequirementsScore,
    experienceQuality: experienceQualityScore,
    contentQuality: contentQualityScore,
    details: {
      keywordCoverage: {
        score: keywordCoverageScore,
        weight: 0.35,
        rationale: jobContextEnabled
          ? "Mesure la couverture des competences et mots-cles critiques de l'offre, avec ponderation renforcee des termes obligatoires."
          : "Mesure la densite de competences explicites pour une analyse ATS sans offre ciblee.",
      },
      blockingRequirements: {
        score: blockingRequirementsScore,
        weight: 0.2,
        rationale: jobContextEnabled
          ? "Verifie les pre-requis obligatoires: diplome, langue, experience, outils imposes."
          : "Aucune exigence obligatoire n'a ete fournie, score neutralise a 100.",
      },
      structure: {
        score: structureScore,
        weight: 0.15,
        rationale: "Evalue la presence des sections standards lisibles par ATS.",
      },
      readability: {
        score: readabilityScore,
        weight: 0.1,
        rationale: "Analyse la lisibilite du document extrait et les risques de format.",
      },
      experienceQuality: {
        score: experienceQualityScore,
        weight: 0.1,
        rationale: "Mesure la qualite des experiences (verbes d'action, resultats chiffres).",
      },
      contentQuality: {
        score: contentQualityScore,
        weight: 0.1,
        rationale: "Mesure la richesse et la completude globale du contenu professionnel.",
      },
    },
    penalties,
  };
}
