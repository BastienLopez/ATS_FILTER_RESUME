import {
  KNOWN_LANGUAGES,
  KNOWN_SKILLS,
  KNOWN_TOOLS,
  LANGUAGE_SYNONYMS,
  SKILL_SYNONYMS,
} from "@/content/lexicons";
import { toSearchable, tokenize } from "@/lib/text";
import { toUniqueSorted } from "@/lib/utils";

const STOPWORDS = new Set([
  "avec",
  "pour",
  "dans",
  "vous",
  "nous",
  "une",
  "des",
  "les",
  "the",
  "and",
  "or",
  "sur",
  "par",
  "qui",
  "que",
  "this",
  "that",
  "from",
  "your",
  "notre",
  "votre",
  "minimum",
  "experience",
  "poste",
  "profil",
  "mission",
  "responsabilites",
]);

function includesTerm(searchableText: string, term: string) {
  return searchableText.includes(term.toLowerCase());
}

function includesWithSynonyms(searchableText: string, term: string) {
  if (includesTerm(searchableText, term)) {
    return true;
  }

  const synonyms = SKILL_SYNONYMS[term];
  if (!synonyms) {
    return false;
  }

  return synonyms.some((synonym) => includesTerm(searchableText, synonym));
}

export function extractKnownSkills(text: string) {
  const searchable = toSearchable(text);
  return KNOWN_SKILLS.filter((skill) => includesWithSynonyms(searchable, skill));
}

export function extractKnownTools(text: string) {
  const searchable = toSearchable(text);
  return KNOWN_TOOLS.filter((tool) => includesTerm(searchable, tool));
}

export function extractKnownLanguages(text: string) {
  const searchable = toSearchable(text);
  return KNOWN_LANGUAGES.filter((language) => {
    if (includesTerm(searchable, language)) {
      return true;
    }
    return (LANGUAGE_SYNONYMS[language] ?? []).some((synonym) => includesTerm(searchable, synonym));
  });
}

export function extractHighValueKeywords(text: string) {
  const tokens = tokenize(text).filter(
    (token) => token.length > 2 && token.length <= 24 && !STOPWORDS.has(token),
  );

  const frequencies = new Map<string, number>();
  for (const token of tokens) {
    frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
  }

  return Array.from(frequencies.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([keyword]) => keyword);
}

export function extractJobKeywords(text: string) {
  return toUniqueSorted([
    ...extractKnownSkills(text),
    ...extractKnownTools(text),
    ...extractKnownLanguages(text),
    ...extractHighValueKeywords(text),
  ]);
}

export function termMatchesText(text: string, keyword: string) {
  const searchable = toSearchable(text);
  return includesWithSynonyms(searchable, keyword);
}
