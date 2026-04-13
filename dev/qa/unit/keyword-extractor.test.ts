import { describe, expect, it } from "vitest";
import {
  extractHighValueKeywords,
  extractJobKeywords,
  extractKnownSkills,
  termMatchesText,
} from "@/services/analysis/keyword-extractor";

describe("keyword extractor", () => {
  it("extracts known skills and handles synonyms", () => {
    const text = "Experience avec NextJS, React, TypeScript, CI/CD et Node.";
    const skills = extractKnownSkills(text);

    expect(skills).toEqual(expect.arrayContaining(["next.js", "react", "typescript", "ci/cd", "node.js"]));
  });

  it("extracts high value keywords with frequencies", () => {
    const text = "product roadmap product strategy backlog roadmap product";
    const keywords = extractHighValueKeywords(text);

    expect(keywords).toContain("product");
    expect(keywords).toContain("roadmap");
  });

  it("builds job keywords and matches text terms", () => {
    const text = "Role requires SQL, Jira, Figma and English communication.";
    const keywords = extractJobKeywords(text);

    expect(keywords).toEqual(expect.arrayContaining(["sql", "jira", "figma", "anglais"]));
    expect(termMatchesText("Expertise en Jira et SQL", "sql")).toBe(true);
  });
});
