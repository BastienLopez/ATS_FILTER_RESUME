import { describe, expect, it } from "vitest";
import { buildMatchingResult } from "@/services/analysis/matching";
import { parseCvProfile } from "@/services/parsers/cv-profile-parser";
import { parseJobDescription } from "@/services/parsers/job-parser";

describe("matching heuristics", () => {
  it("detects title proximity with common role synonyms", () => {
    const cv = parseCvProfile(`
      Alice Martin
      alice@email.com
      Product Owner Senior
      Experience 2017 - 2026
      Competences: SQL, Jira, roadmap
    `);

    const job = parseJobDescription(`
      Product Manager Senior
      Exigences obligatoires:
      - SQL obligatoire
      - 5 ans d'experience
    `);

    const matching = buildMatchingResult(cv, job);
    expect(matching.titleMatch).toBe(true);
  });

  it("applies stronger coverage ratio when mandatory keywords are missing", () => {
    const cv = parseCvProfile(`
      Hugo Leroy
      hugo@email.com
      Data Engineer
      Competences: Jira, Figma
      Experience: 2020 - 2026
    `);

    const job = parseJobDescription(`
      Data Engineer
      Exigences obligatoires:
      - SQL obligatoire
      Exigences preferees:
      - Jira
      - Figma
    `);

    const matching = buildMatchingResult(cv, job);
    expect(matching.requiredKeywords).toEqual(expect.arrayContaining(["sql", "jira", "figma"]));
    expect(matching.coverageRatio).toBeLessThan(0.67);
    expect(matching.coverageRatio).toBe(0.5);
  });

  it("extracts location constraints from offer and matches candidate location", () => {
    const cv = parseCvProfile(`
      Sarah Dupuis
      sarah@email.com
      Localisation: Paris
      Developpeuse Full Stack
      Experience 2018 - 2026
      Skills: TypeScript, React, Node.js
    `);

    const job = parseJobDescription(`
      Developpeur Full Stack
      Exigences obligatoires:
      - Presence sur site a Paris
      - TypeScript obligatoire
    `);

    const matching = buildMatchingResult(cv, job);
    const locationRequirement = matching.requirementMatches.find((item) => item.type === "location");

    expect(locationRequirement?.label).toContain("Paris");
    expect(locationRequirement?.matched).toBe(true);
  });
});