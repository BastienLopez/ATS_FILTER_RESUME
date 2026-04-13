import type { ContactInfo } from "@/types/analysis";

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,3}\)?[\s.-]?)?(?:\d{2,4}[\s.-]?){2,4}\d{2,4}/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i;
const PORTFOLIO_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:github\.com|behance\.net|dribbble\.com|portfolio\.[^\s]+|[a-z0-9-]+\.(?:dev|io|me))/i;
const LOCATION_REGEX =
  /(paris|lyon|lille|marseille|bordeaux|nantes|toulouse|reims|france|belgique|suisse|remote|hybride)/i;

export function extractContactInfo(rawText: string): ContactInfo {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const firstLines = lines.slice(0, 8).join(" ");
  const possibleName = lines.find((line) => /^\p{L}[\p{L}' -]{3,50}$/u.test(line));
  const location = lines.find((line) => LOCATION_REGEX.test(line));

  return {
    fullName: possibleName,
    email: rawText.match(EMAIL_REGEX)?.[0],
    phone: rawText.match(PHONE_REGEX)?.[0],
    linkedIn: rawText.match(LINKEDIN_REGEX)?.[0],
    portfolio: rawText.match(PORTFOLIO_REGEX)?.[0],
    location: location ?? firstLines.match(LOCATION_REGEX)?.[0],
  };
}
