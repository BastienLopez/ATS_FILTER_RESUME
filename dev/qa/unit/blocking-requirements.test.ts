import { describe, expect, it } from "vitest";
import { buildMatchingResult } from "@/services/analysis/matching";
import { parseCvProfile } from "@/services/parsers/cv-profile-parser";
import { parseJobDescription } from "@/services/parsers/job-parser";

const jobDescription = `
Nous recrutons un Product Owner.
Exigences obligatoires :
- 5 ans minimum d'experience.
- Anglais professionnel obligatoire.
- Maitrise SQL obligatoire.
- Presence sur site a Paris.
`;

describe("blocking requirements", () => {
  it("detects missing mandatory requirements", () => {
    const cv = parseCvProfile(`
      Camille Dupont
      camille@email.com
      Product Owner
      Experience de 2 ans
      Competences: Jira, communication
      Localisation: Lyon
    `);
    const job = parseJobDescription(jobDescription);
    const matching = buildMatchingResult(cv, job);

    expect(job.mandatoryRequirements.length).toBeGreaterThan(0);
    expect(matching.mandatoryMissing.length).toBeGreaterThan(0);
    expect(matching.mandatoryMissing.some((item) => item.type === "skill" || item.type === "language")).toBe(true);
  });

  it("marks mandatory requirements as matched when covered", () => {
    const cv = parseCvProfile(`
      Alex Martin
      alex@email.com
      Product Owner Senior
      Experience: 2016 - 2026
      Skills: SQL, Jira, anglais
      Localisation: Paris
    `);
    const job = parseJobDescription(jobDescription);
    const matching = buildMatchingResult(cv, job);

    expect(matching.mandatoryMissing.length).toBeLessThan(job.mandatoryRequirements.length);
    expect(matching.mandatoryMatched.length).toBeGreaterThan(0);
  });
});
