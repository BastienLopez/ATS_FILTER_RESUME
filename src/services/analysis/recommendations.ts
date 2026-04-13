import type { AnalysisReport, AnalysisScores, ParsedCvProfile, ParsedJobDescription, Recommendation } from "@/types/analysis";
import type { MatchingResult } from "@/services/analysis/matching";

interface RecommendationInput {
  analysisMode: AnalysisReport["analysisMode"];
  cv: ParsedCvProfile;
  job: ParsedJobDescription;
  matching: MatchingResult;
  scores: AnalysisScores;
}

function buildRecommendation(
  id: string,
  priority: Recommendation["priority"],
  issue: string,
  whyItMatters: string,
  estimatedImpact: number,
  howToFix: string,
  example?: string,
): Recommendation {
  return { id, priority, issue, whyItMatters, estimatedImpact, howToFix, example };
}

function getMissingCriticalSections(cv: ParsedCvProfile) {
  const required = ["title", "summary", "experience", "education", "skills"] as const;
  return required.filter((key) => !cv.sections.some((section) => section.key === key && section.found));
}

export function generateRecommendations({ analysisMode, cv, job, matching, scores }: RecommendationInput): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const missingSections = getMissingCriticalSections(cv);

  if (!cv.contact.email || !cv.contact.phone) {
    recommendations.push(
      buildRecommendation(
        "contact-complete",
        "haute",
        "Coordonnees incompletes",
        "Sans email ou telephone, le profil est fortement penalise et difficile a contacter.",
        18,
        "Ajoutez en haut du CV: nom complet, email professionnel, telephone et localisation.",
        "Exemple: prenom.nom@email.com | +33 6 12 34 56 78 | Paris",
      ),
    );
  }

  if (missingSections.length > 0) {
    recommendations.push(
      buildRecommendation(
        "missing-critical-sections",
        missingSections.includes("experience") || missingSections.includes("skills") ? "haute" : "moyenne",
        "Sections ATS critiques manquantes",
        "Un ATS comprend mieux un CV avec des sections explicites et standards.",
        16,
        "Ajoutez des titres clairs pour chaque bloc important: Profil, Experience, Formation, Competences.",
        `Sections a ajouter en priorite: ${missingSections.join(", ")}`,
      ),
    );
  }

  if (matching.mandatoryMissing.length > 0) {
    recommendations.push(
      buildRecommendation(
        "mandatory-gap",
        "haute",
        "Exigences obligatoires manquantes",
        "Un prerequis absent peut bloquer automatiquement la candidature cote ATS.",
        25,
        "Traitez chaque exigence obligatoire dans une section dediee ou une ligne d'experience.",
        `Elements a couvrir: ${matching.mandatoryMissing.map((item) => item.label).join(", ")}`,
      ),
    );
  }

  if (analysisMode === "with_job" && matching.missingKeywords.length > 0) {
    recommendations.push(
      buildRecommendation(
        "keywords-gap",
        scores.keywordCoverage < 45 ? "haute" : "moyenne",
        "Mots-cles strategiques insuffisants",
        "La couverture des termes metier influence fortement le rang ATS.",
        16,
        "Ajoutez les mots-cles pertinents dans les experiences, competences et projets.",
        `A integrer de maniere naturelle: ${matching.missingKeywords.slice(0, 10).join(", ")}`,
      ),
    );
  }

  if (analysisMode === "with_job" && job.title && !matching.titleMatch) {
    recommendations.push(
      buildRecommendation(
        "title-alignment",
        "moyenne",
        "Intitule de poste peu explicite",
        "Les ATS comparent le titre du CV a l'intitule cible pour classer la pertinence du profil.",
        11,
        "Ajoutez un titre de profil aligne en haut du CV et reutilisez les termes de l'offre.",
        `Exemple: \"${job.title}\" en titre principal, puis variantes proches dans le resume.`,
      ),
    );
  }

  if (analysisMode === "with_job" && job.seniority && !matching.seniorityMatch) {
    recommendations.push(
      buildRecommendation(
        "seniority-alignment",
        "moyenne",
        "Niveau d'experience a clarifier",
        "Un decalage de seniorite peut faire baisser le classement ATS meme avec de bonnes competences.",
        10,
        "Precisez vos annees d'experience par domaine et mettez en avant les missions correspondant au niveau vise.",
      ),
    );
  }

  if (
    analysisMode === "with_job" &&
    typeof job.yearsOfExperience === "number" &&
    typeof cv.experienceYears === "number" &&
    cv.experienceYears + 1 < job.yearsOfExperience
  ) {
    recommendations.push(
      buildRecommendation(
        "experience-years-gap",
        "haute",
        "Ecart sur les annees d'experience demandees",
        "Certaines offres appliquent un filtrage strict sur le nombre minimum d'annees.",
        14,
        "Rendez visibles les periodes exactes (mois/annees) et valorisez les experiences les plus proches du poste cible.",
      ),
    );
  }

  if (analysisMode === "ats_only" && (cv.extractedSkills.length < 6 || cv.extractedTools.length < 3)) {
    recommendations.push(
      buildRecommendation(
        "ats-only-skill-density",
        "moyenne",
        "Peu de signaux competences detectes",
        "Sans offre ciblee, les ATS se basent fortement sur la clarte des competences et outils explicites.",
        12,
        "Ajoutez une section Competences avec technologies, frameworks, outils et niveau d'usage concret.",
        "Exemple: React (3 ans), TypeScript (4 ans), Docker (production), GitHub Actions (CI/CD).",
      ),
    );
  }

  if (scores.readability < 60 || cv.metrics.riskyFormatIndicators.length > 0) {
    recommendations.push(
      buildRecommendation(
        "readability-layout",
        "haute",
        "Lisibilite ATS fragile",
        "Des elements decoratifs ou un export instable peuvent couper des informations importantes.",
        14,
        "Reexportez en PDF texte simple, supprimez les pictogrammes decoratifs et privilegiez une mise en page mono-colonne.",
      ),
    );
  }

  if (scores.experienceQuality < 55) {
    recommendations.push(
      buildRecommendation(
        "experience-impact",
        "moyenne",
        "Experiences peu orientees impact",
        "Les ATS et recruteurs valorisent les resultats concrets et mesurables.",
        10,
        "Ajoutez des verbes d'action et au moins un indicateur chiffre par mission cle.",
        "Exemple: \"Automatise le reporting hebdomadaire, -35% de temps de production.\"",
      ),
    );
  }

  if (scores.contentQuality < 60 || cv.metrics.wordCount < 220) {
    recommendations.push(
      buildRecommendation(
        "content-richness",
        "moyenne",
        "Contenu trop leger sur certaines categories",
        "Un CV trop court ou peu detaille perd des points de completude et de matching.",
        9,
        "Detaillez chaque experience: contexte, stack, actions, resultats et responsabilites.",
      ),
    );
  }

  if (scores.structure < 65) {
    recommendations.push(
      buildRecommendation(
        "structure-standard",
        "moyenne",
        "Structure non standard ATS",
        "Des sections ambigues ou manquantes reduisent la lisibilite automatisee.",
        12,
        "Utilisez des intitules simples: Resume, Experience, Formation, Competences, Langues, Certifications.",
      ),
    );
  }

  recommendations.push(
    buildRecommendation(
      "bonus-links",
      "bonus",
      "Renforcer la credibilite du profil",
      "Les liens verifiables ameliorent la confiance et le contexte de lecture.",
      4,
      "Ajoutez LinkedIn et portfolio/GitHub si pertinents, avec URL completes.",
    ),
  );

  return Array.from(new Map(recommendations.map((recommendation) => [recommendation.id, recommendation])).values())
    .sort((a, b) => {
      const weight = { haute: 3, moyenne: 2, bonus: 1 } as const;
      return weight[b.priority] - weight[a.priority] || b.estimatedImpact - a.estimatedImpact;
    })
    .slice(0, 12);
}
