import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE_BYTES } from "@/lib/config";
import { analyzePayloadSchema, fileSchema, inferExtension } from "@/lib/validators/analyze-request";

describe("analyze request validation", () => {
  it("validates payload with full job description", () => {
    const valid = analyzePayloadSchema.safeParse({
      jobDescription: "x".repeat(140),
    });
    expect(valid.success).toBe(true);
  });

  it("accepts empty job description for ATS-only mode", () => {
    const valid = analyzePayloadSchema.safeParse({
      jobDescription: "",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects too short job description when provided", () => {
    const invalid = analyzePayloadSchema.safeParse({
      jobDescription: "Description courte",
    });
    expect(invalid.success).toBe(false);
  });

  it("accepts supported file metadata", () => {
    const valid = fileSchema.safeParse({
      name: "cv.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: MAX_FILE_SIZE_BYTES - 10,
    });
    expect(valid.success).toBe(true);
  });

  it("rejects unsupported file", () => {
    const invalid = fileSchema.safeParse({
      name: "cv.png",
      type: "image/png",
      size: 1000,
    });
    expect(invalid.success).toBe(false);
  });

  it("infers extension from file name", () => {
    expect(inferExtension("my-cv.PDF")).toBe("pdf");
    expect(inferExtension("resume.docx")).toBe("docx");
    expect(inferExtension("resume.txt")).toBeNull();
  });
});
