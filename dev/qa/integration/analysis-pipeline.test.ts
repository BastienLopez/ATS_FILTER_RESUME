// @vitest-environment node
import { describe, expect, it } from "vitest";
import { runAtsAnalysis } from "@/services/analysis/ats-analyzer";
import { extractTextFromFile } from "@/services/parsers/file-text-extractor";

describe("analysis pipeline integration", () => {
  it("produces a full report in nominal case", () => {
    const report = runAtsAnalysis({
      upload: {
        fileName: "cv.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "docx",
        size: 120000,
      },
      cvText: `
        Alex Martin
        alex@email.com | +33 6 12 34 56 78 | Paris
        Product Owner Senior
        Resume: 8 ans d'experience sur des produits SaaS B2B.
        Experience
        - Pilote roadmap data, +24% adoption
        - Utilise SQL, Jira, Figma, Power BI
        Formation
        - Master SI
        Competences
        - SQL, Jira, Figma, Agile
        Langues
        - Francais, Anglais
      `,
      jobDescription: `
        Product Owner Senior
        Exigences obligatoires:
        - 5 ans minimum d'experience
        - SQL obligatoire
        - Anglais obligatoire
        - Presence a Paris
        Exigences preferees:
        - Jira et Figma
      `,
    });

    expect(report.scores.global).toBeGreaterThan(60);
    expect(report.scores.keywordCoverage).toBeGreaterThan(50);
    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.blockingRequirements.length).toBeGreaterThan(0);
    expect(report.extractionStats.wordCount).toBeGreaterThan(20);
    expect(report.cvTextPreview).toContain("Langues");
  });

  it("returns degraded scores when CV is weak", () => {
    const report = runAtsAnalysis({
      upload: {
        fileName: "cv.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "docx",
        size: 45000,
      },
      cvText: "CV - profil motive.",
      jobDescription: `
        Data Engineer
        Exigences obligatoires:
        - 5 ans d'experience
        - Python obligatoire
        - Certification AWS
      `,
    });

    expect(report.scores.global).toBeLessThan(60);
    expect(report.scores.penalties.length).toBeGreaterThan(0);
    expect(report.missingKeywords.length).toBeGreaterThan(0);
  });

  it("fails gracefully on unreadable pdf parsing", async () => {
    const corruptedPdf = new File([Buffer.from("not_a_real_pdf")], "broken.pdf", { type: "application/pdf" });
    await expect(extractTextFromFile(corruptedPdf, "pdf")).rejects.toBeTruthy();
  });
});
