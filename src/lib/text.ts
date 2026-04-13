const DIACRITIC_REGEX = /[\u0300-\u036f]/g;
const PRIVATE_USE_REGEX = /[\uE000-\uF8FF]/g;
const CONTROL_REGEX = /[\u0000-\u0008\u000B-\u001F\u007F]/g;
const PAGE_MARKER_REGEX = /--\s*\d+\s+of\s+\d+\s*--/gi;
const DECORATIVE_SYMBOL_REGEX = /[●▪■◆►▶◦]/g;

export function sanitizeExtractedText(input: string) {
  return input
    .replace(/\r\n?/g, "\n")
    .replace(PAGE_MARKER_REGEX, "")
    .replace(PRIVATE_USE_REGEX, " ")
    .replace(CONTROL_REGEX, " ")
    .replace(DECORATIVE_SYMBOL_REGEX, "-")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeText(input: string) {
  return sanitizeExtractedText(input)
    .normalize("NFD")
    .replace(DIACRITIC_REGEX, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function toSearchable(input: string) {
  return normalizeText(input).toLowerCase();
}

export function tokenize(input: string) {
  return toSearchable(input)
    .split(/[^a-z0-9+.#/]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

export function excerpt(input: string, maxLength = 900) {
  const content = input.trim();
  if (content.length <= maxLength) {
    return content;
  }

  return `${content.slice(0, maxLength).trim()}...`;
}
