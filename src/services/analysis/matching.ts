import { toSearchable } from "@/lib/text";
import { round, toUniqueSorted } from "@/lib/utils";
import { termMatchesText } from "@/services/analysis/keyword-extractor";
import type { JobRequirement, ParsedCvProfile, ParsedJobDescription } from "@/types/analysis";

export interface MatchingResult {
  requiredKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  titleMatch: boolean;
  seniorityMatch: boolean;
  requirementMatches: JobRequirement[];
  mandatoryMissing: JobRequirement[];
  mandatoryMatched: JobRequirement[];
  coverageRatio: number;
}

const TITLE_STOPWORDS = new Set([
  "de",
  "du",
  "des",
  "et",
  "the",
  "for",
  "with",
  "senior",
  "junior",
  "lead",
  "principal",
  "poste",
  "role",
  "h-f",
  "hf",
]);

const TITLE_SYNONYMS: Array<{ key: RegExp; aliases: string[] }> = [
  { key: /developpeur full ?stack|full ?stack developer/i, aliases: ["full stack", "fullstack", "software engineer"] },
  {
    key: /product owner|chef de produit|product manager/i,
    aliases: ["product owner", "product manager", "chef de produit"],
  },
  { key: /data engineer|ingenieur data/i, aliases: ["data engineer", "ingenieur data"] },
  { key: /devops|sre/i, aliases: ["devops", "site reliability", "sre"] },
];

function parseExperienceRequirementYears(requirementLabel: string) {
  const match = requirementLabel.match(/(\d{1,2})\+?/);
  if (!match) {
    return undefined;
  }
  const years = Number(match[1]);
  return Number.isFinite(years) ? years : undefined;
}

function extractTitleTokens(title: string) {
  return toSearchable(title)
    .split(/[^a-z0-9+#/.]+/g)
    .filter((token) => token.length > 2 && !TITLE_STOPWORDS.has(token));
}

function computeTitleMatch(cv: ParsedCvProfile, jobTitle?: string) {
  if (!jobTitle) {
    return true;
  }

  const header = toSearchable(cv.rawText.slice(0, 420));
  const target = toSearchable(jobTitle);

  if (header.includes(target)) {
    return true;
  }

  const tokens = extractTitleTokens(jobTitle);
  if (tokens.length > 0) {
    const matchedCount = tokens.filter((token) => header.includes(token)).length;
    const ratio = matchedCount / tokens.length;
    if ((tokens.length <= 2 && matchedCount === tokens.length) || (tokens.length >= 3 && ratio >= 0.6)) {
      return true;
    }
  }

  const synonymGroup = TITLE_SYNONYMS.find((item) => item.key.test(jobTitle));
  if (synonymGroup) {
    return synonymGroup.aliases.some((alias) => header.includes(toSearchable(alias)));
  }

  return false;
}

function findLocationConstraint(requirement: JobRequirement) {
  const label = toSearchable(requirement.label);
  const match = label.match(/localisation:\s*([a-z0-9 +.-]+)/i);
  if (!match) {
    return undefined;
  }
  return match[1]?.trim();
}

function matchesSpecificCertification(cvText: string, requirement: JobRequirement) {
  const normalized = toSearchable(requirement.label);
  if (/aws/.test(normalized)) {
    return /aws certified|aws certification|aws/.test(cvText);
  }
  if (/azure/.test(normalized)) {
    return /azure certification|az-900|azure/.test(cvText);
  }
  if (/google cloud|gcp/.test(normalized)) {
    return /google cloud|gcp certification|gcp/.test(cvText);
  }
  if (/scrum/.test(normalized)) {
    return /scrum master|psm|csm|scrum/.test(cvText);
  }
  if (/pmp/.test(normalized)) {
    return /\bpmp\b/.test(cvText);
  }
  if (/itil/.test(normalized)) {
    return /\bitil\b/.test(cvText);
  }
  if (/ceh/.test(normalized)) {
    return /\bceh\b/.test(cvText);
  }
  if (/iso 27001/.test(normalized)) {
    return /iso ?27001/.test(cvText);
  }
  return /certification/.test(cvText);
}

function matchesDegreeRequirement(cvText: string, requirement: JobRequirement) {
  const normalized = toSearchable(requirement.label);
  if (/doctorat|phd/.test(normalized)) {
    return /doctorat|phd/.test(cvText);
  }
  if (/bac\+5|master/.test(normalized)) {
    return /bac\+5|master|msc|ingenieur/.test(cvText);
  }
  if (/bac\+3|licence|bachelor/.test(normalized)) {
    return /bac\+3|licence|bachelor|master|bac\+5|ingenieur/.test(cvText);
  }
  return /(master|bachelor|licence|diplome|bac\+3|bac\+5|ingenieur)/.test(cvText);
}

function matchRequirement(cv: ParsedCvProfile, requirement: JobRequirement) {
  const cvText = toSearchable(cv.rawText);

  switch (requirement.type) {
    case "skill":
    case "tool":
    case "language":
      return termMatchesText(cv.rawText, requirement.label);
    case "certification":
      return cv.certifications.length > 0 && matchesSpecificCertification(cvText, requirement);
    case "degree":
      return matchesDegreeRequirement(cvText, requirement);
    case "experience": {
      const requiredYears = parseExperienceRequirementYears(requirement.label);
      if (!requiredYears) {
        return cvText.includes("experience");
      }
      if (typeof cv.experienceYears !== "number") {
        return /\b\d{1,2}\+?\s*(ans?|annees?|years?)\b/.test(cvText);
      }
      return cv.experienceYears >= requiredYears;
    }
    case "location": {
      const constraint = findLocationConstraint(requirement);
      const cvLocation = toSearchable(cv.contact.location ?? "");
      if (!constraint) {
        return Boolean(cv.contact.location);
      }
      if (constraint.includes("remote")) {
        return cvLocation.includes("remote") || cvText.includes("remote");
      }
      return cvLocation.includes(constraint) || cvText.includes(constraint);
    }
    case "onsite": {
      const remoteOnly = /(full remote|100% remote|remote only|teletravail complet)/.test(cvText);
      const hasPresenceSignal =
        /(sur site|on[- ]?site|hybride|presentiel)/.test(cvText) || Boolean(cv.contact.location);
      return !remoteOnly && hasPresenceSignal;
    }
    case "visa":
      return /(visa|work permit|autorisation|titre de sejour|droit au travail)/.test(cvText);
    default:
      return cvText.includes(toSearchable(requirement.label));
  }
}

export function buildMatchingResult(cv: ParsedCvProfile, job: ParsedJobDescription): MatchingResult {
  const requiredKeywords = toUniqueSorted([
    ...job.hardSkills,
    ...job.tools,
    ...job.languages,
    ...job.mandatoryRequirements
      .filter((requirement) => requirement.type === "skill" || requirement.type === "tool" || requirement.type === "language")
      .map((requirement) => requirement.label),
  ]);

  const matchedKeywords = requiredKeywords.filter((keyword) => termMatchesText(cv.rawText, keyword));
  const missingKeywords = requiredKeywords.filter((keyword) => !termMatchesText(cv.rawText, keyword));

  const mandatoryKeywordSet = new Set(
    job.mandatoryRequirements
      .filter((requirement) => requirement.type === "skill" || requirement.type === "tool" || requirement.type === "language")
      .map((requirement) => toSearchable(requirement.label)),
  );

  const requirementMatches = [...job.mandatoryRequirements, ...job.preferredRequirements].map((requirement) => {
    const matched = matchRequirement(cv, requirement);
    return {
      ...requirement,
      matched,
      cvEvidence: matched ? "Present dans le CV extrait" : undefined,
    };
  });

  const mandatoryMissing = requirementMatches.filter((requirement) => requirement.mandatory && !requirement.matched);
  const mandatoryMatched = requirementMatches.filter((requirement) => requirement.mandatory && requirement.matched);

  const titleMatch = computeTitleMatch(cv, job.title);

  const seniorityMatch =
    !job.seniority ||
    typeof cv.experienceYears !== "number" ||
    (job.seniority === "junior" && cv.experienceYears <= 3) ||
    (job.seniority === "senior" && cv.experienceYears >= 4) ||
    ((job.seniority === "lead" || job.seniority === "principal") && cv.experienceYears >= 7);

  const keywordWeights = new Map<string, number>();
  for (const keyword of requiredKeywords) {
    const normalized = toSearchable(keyword);
    keywordWeights.set(keyword, mandatoryKeywordSet.has(normalized) ? 2 : 1);
  }
  const totalWeight = Array.from(keywordWeights.values()).reduce((sum, weight) => sum + weight, 0);
  const matchedWeight = matchedKeywords.reduce((sum, keyword) => sum + (keywordWeights.get(keyword) ?? 1), 0);
  const coverageRatio = totalWeight === 0 ? 1 : round(matchedWeight / totalWeight, 3);

  return {
    requiredKeywords,
    matchedKeywords,
    missingKeywords,
    titleMatch,
    seniorityMatch,
    requirementMatches,
    mandatoryMissing,
    mandatoryMatched,
    coverageRatio,
  };
}