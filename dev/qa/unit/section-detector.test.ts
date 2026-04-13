import { describe, expect, it } from "vitest";
import { detectSections } from "@/services/analysis/section-detector";

const sampleCv = `
Alex Martin
alex@email.com

RESUME
Product manager orienté SaaS.

EXPERIENCE
- Pilotage roadmap produit.

FORMATION
Master Digital Business.

COMPETENCES
SQL, Jira, Figma.
`;

describe("section detector", () => {
  it("detects standard sections in ATS-friendly CV", () => {
    const sections = detectSections(sampleCv);

    expect(sections.find((section) => section.key === "summary")?.found).toBe(true);
    expect(sections.find((section) => section.key === "experience")?.found).toBe(true);
    expect(sections.find((section) => section.key === "education")?.found).toBe(true);
    expect(sections.find((section) => section.key === "skills")?.found).toBe(true);
  });

  it("returns low coverage when sections are absent", () => {
    const sections = detectSections("Texte libre sans section structurée");
    const foundCount = sections.filter((section) => section.found).length;

    expect(foundCount).toBeLessThan(4);
  });
});
