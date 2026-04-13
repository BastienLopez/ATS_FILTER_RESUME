import type { AnalysisReport, AnalysisScores } from "@/types/analysis";

export function resolveVerdict(score: number) {
  if (score >= 80) {
    return "Forte compatibilite ATS";
  }
  if (score >= 60) {
    return "Compatibilite ATS moyenne";
  }
  if (score >= 40) {
    return "Risque important de rejet automatise";
  }
  return "Compatibilite ATS faible";
}

export function buildExecutiveExplanation(scores: AnalysisScores, analysisMode: AnalysisReport["analysisMode"]) {
  if (analysisMode === "ats_only") {
    if (scores.global >= 80) {
      return "Le CV est globalement bien structure pour les ATS, meme sans offre ciblee.";
    }
    if (scores.global >= 60) {
      return "Le CV est exploitable par ATS, avec quelques ajustements utiles sur la lisibilite et la structure.";
    }
    if (scores.global >= 40) {
      return "Le CV presente des points faibles ATS a corriger avant envoi massif.";
    }
    return "Le CV presente plusieurs blocages critiques pour un filtrage ATS fiable.";
  }

  if (scores.global >= 80) {
    return "Le CV couvre bien l'offre et suit une structure generalement lisible par ATS.";
  }
  if (scores.global >= 60) {
    return "Le profil est partiellement aligne. Quelques ajustements peuvent augmenter nettement la probabilite de passage ATS.";
  }
  if (scores.global >= 40) {
    return "Des ecarts majeurs existent sur les mots-cles, la structure ou les pre-requis obligatoires.";
  }
  return "Le CV presente plusieurs blocages critiques pour un filtrage ATS fiable.";
}

export function computeConfidenceLevel(scores: AnalysisScores, riskyIndicatorsCount: number) {
  let confidence = 90;
  confidence -= scores.penalties.length * 6;
  confidence -= riskyIndicatorsCount * 3;
  if (scores.keywordCoverage < 30) {
    confidence -= 8;
  }
  return Math.max(35, Math.min(95, confidence));
}
