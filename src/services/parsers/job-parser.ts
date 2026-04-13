import {
  CERTIFICATION_PATTERNS,
  DEGREE_PATTERNS,
  KNOWN_LANGUAGES,
  KNOWN_SKILLS,
  KNOWN_TOOLS,
} from "@/content/lexicons";
import { normalizeText, toSearchable } from "@/lib/text";
import { toUniqueSorted } from "@/lib/utils";
import { extractKnownLanguages, extractKnownSkills, extractKnownTools } from "@/services/analysis/keyword-extractor";
import type { JobRequirement, ParsedJobDescription, RequirementType } from "@/types/analysis";

const MANDATORY_HINT = /(obligatoire|must|required|indispensable|minim(?:um|ale)|imperatif)/i;
const PREFERRED_HINT = /(prefere|souhaite|atout|nice to have|bonus)/i;
const ONSITE_HINT = /(sur site|on[- ]site|hybride|presentiel|jours\/semaine)/i;
const VISA_HINT = /(visa|work permit|droit au travail|autorisation de travail)/i;
const LOCATION_HINT = /(paris|lyon|lille|marseille|bordeaux|nantes|toulouse|france|belgique|suisse|remote)/i;
const MANDATORY_BLOCK_HINT = /(exigences?|prerequis)\s+(obligatoires?|must have|required)/i;
const PREFERRED_BLOCK_HINT = /(exigences?|prerequis)\s+(prefere(?:es?)?|souhaite(?:es?)?|nice to have|bonus)/i;

const KNOWN_LOCATIONS = [
  "paris",
  "lyon",
  "lille",
  "marseille",
  "bordeaux",
  "nantes",
  "toulouse",
  "rennes",
  "strasbourg",
  "france",
  "belgique",
  "suisse",
  "luxembourg",
  "remote",
  "full remote",
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createRequirement(
  type: RequirementType,
  label: string,
  mandatory: boolean,
  evidence: string,
): JobRequirement {
  return {
    id: `${type}-${slugify(label)}`,
    type,
    label,
    mandatory,
    matched: false,
    evidence,
  };
}

function parseYearsOfExperience(text: string) {
  const match = text.match(/(\d{1,2})\+?\s*(ans?|annees?|years?)/i);
  if (!match) {
    return undefined;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseSeniority(text: string) {
  if (/principal|staff/i.test(text)) {
    return "principal";
  }
  if (/lead|head|manager/i.test(text)) {
    return "lead";
  }
  if (/senior|confirme/i.test(text)) {
    return "senior";
  }
  if (/junior|debutant/i.test(text)) {
    return "junior";
  }
  return undefined;
}

function extractLocations(line: string) {
  const searchable = toSearchable(line);
  return KNOWN_LOCATIONS.filter((location) => searchable.includes(location));
}

function toDisplayLocation(location: string) {
  if (location === "full remote") {
    return "full remote";
  }
  if (location === "remote") {
    return "remote";
  }
  return location.charAt(0).toUpperCase() + location.slice(1);
}

function buildDegreeLabel(line: string) {
  if (/doctorat|phd/i.test(line)) {
    return "Doctorat";
  }
  if (/bac\+5|master|msc|ingenieur/i.test(line)) {
    return "Diplome niveau bac+5 / master";
  }
  if (/bac\+3|licence|bachelor/i.test(line)) {
    return "Diplome niveau bac+3 / licence";
  }
  return "Diplome demande";
}

function buildCertificationLabel(line: string) {
  if (/aws/i.test(line)) {
    return "Certification AWS";
  }
  if (/azure/i.test(line)) {
    return "Certification Azure";
  }
  if (/gcp|google cloud/i.test(line)) {
    return "Certification Google Cloud";
  }
  if (/scrum/i.test(line)) {
    return "Certification Scrum";
  }
  if (/pmp/i.test(line)) {
    return "Certification PMP";
  }
  if (/itil/i.test(line)) {
    return "Certification ITIL";
  }
  if (/ceh/i.test(line)) {
    return "Certification CEH";
  }
  if (/iso ?27001/i.test(line)) {
    return "Certification ISO 27001";
  }
  return "Certification demandee";
}

function collectRequirements(jobText: string, mandatoryByDefault = false) {
  const requirements: JobRequirement[] = [];
  const lines = normalizeText(jobText)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  let blockMode: "mandatory" | "preferred" | "neutral" = "neutral";

  for (const line of lines) {
    if (MANDATORY_BLOCK_HINT.test(line)) {
      blockMode = "mandatory";
      continue;
    }
    if (PREFERRED_BLOCK_HINT.test(line)) {
      blockMode = "preferred";
      continue;
    }

    const lowerLine = toSearchable(line);
    const isExplicitPreferred = PREFERRED_HINT.test(line) || blockMode === "preferred";
    const isMandatoryLine =
      (MANDATORY_HINT.test(line) || blockMode === "mandatory" || mandatoryByDefault) && !isExplicitPreferred;

    const foundSkill = KNOWN_SKILLS.find((skill) => lowerLine.includes(skill));
    if (foundSkill) {
      requirements.push(createRequirement("skill", foundSkill, isMandatoryLine, line));
    }

    const foundTool = KNOWN_TOOLS.find((tool) => lowerLine.includes(tool));
    if (foundTool) {
      requirements.push(createRequirement("tool", foundTool, isMandatoryLine, line));
    }

    const foundLanguage = KNOWN_LANGUAGES.find((language) => lowerLine.includes(language));
    if (foundLanguage) {
      requirements.push(createRequirement("language", foundLanguage, isMandatoryLine, line));
    }

    if (DEGREE_PATTERNS.some((pattern) => pattern.test(line))) {
      requirements.push(createRequirement("degree", buildDegreeLabel(line), isMandatoryLine, line));
    }

    if (CERTIFICATION_PATTERNS.some((pattern) => pattern.test(line))) {
      requirements.push(createRequirement("certification", buildCertificationLabel(line), isMandatoryLine, line));
    }

    if (ONSITE_HINT.test(line)) {
      requirements.push(createRequirement("onsite", "Presence sur site / hybride", isMandatoryLine, line));
    }

    if (VISA_HINT.test(line)) {
      requirements.push(createRequirement("visa", "Droit au travail / visa requis", isMandatoryLine, line));
    }

    if (LOCATION_HINT.test(line)) {
      const locations = extractLocations(line);
      if (locations.length > 0) {
        for (const location of locations) {
          requirements.push(
            createRequirement("location", `Localisation: ${toDisplayLocation(location)}`, isMandatoryLine, line),
          );
        }
      } else {
        requirements.push(createRequirement("location", "Contraintes de localisation", isMandatoryLine, line));
      }
    }

    const years = parseYearsOfExperience(line);
    if (years) {
      requirements.push(createRequirement("experience", `${years}+ ans d'experience`, isMandatoryLine, line));
    }
  }

  const dedup = new Map<string, JobRequirement>();
  for (const requirement of requirements) {
    const current = dedup.get(requirement.id);
    if (!current || (requirement.mandatory && !current.mandatory)) {
      dedup.set(requirement.id, requirement);
    }
  }

  return Array.from(dedup.values());
}

export function parseJobDescription(jobText: string): ParsedJobDescription {
  const normalized = normalizeText(jobText);
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const title = lines.find((line) => line.length <= 90 && !line.includes(":"));
  const seniority = parseSeniority(normalized);
  const yearsOfExperience = parseYearsOfExperience(normalized);

  const hardSkills = toUniqueSorted(extractKnownSkills(normalized));
  const tools = toUniqueSorted(extractKnownTools(normalized));
  const languages = toUniqueSorted(extractKnownLanguages(normalized));
  const softSkills = toUniqueSorted(
    [
      /communication/i.test(normalized) ? "communication" : null,
      /leadership/i.test(normalized) ? "leadership" : null,
      /autonomie/i.test(normalized) ? "autonomie" : null,
      /teamwork|travail d[' ]?equipe/i.test(normalized) ? "travail d'equipe" : null,
    ].filter((value): value is string => Boolean(value)),
  );

  const parsedRequirements = collectRequirements(normalized);
  const mandatoryRequirements = parsedRequirements.filter((requirement) => requirement.mandatory);
  const preferredRequirements = parsedRequirements.filter((requirement) => !requirement.mandatory);

  return {
    title,
    seniority,
    hardSkills,
    tools,
    softSkills,
    mandatoryRequirements,
    preferredRequirements,
    yearsOfExperience,
    languages,
  };
}
