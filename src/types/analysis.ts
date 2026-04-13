export type SupportedFileExtension = "pdf" | "docx";

export type RequirementType =
  | "skill"
  | "tool"
  | "language"
  | "certification"
  | "degree"
  | "experience"
  | "location"
  | "onsite"
  | "visa"
  | "other";

export type RecommendationPriority = "haute" | "moyenne" | "bonus";

export interface UploadMetadata {
  fileName: string;
  mimeType: string;
  extension: SupportedFileExtension;
  size: number;
}

export interface TextExtractionMetrics {
  hasExtractableText: boolean;
  characterCount: number;
  lineCount: number;
  wordCount: number;
  denseTextRatio: number;
  probableImageOnly: boolean;
  riskyFormatIndicators: string[];
}

export interface ContactInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  portfolio?: string;
}

export interface SectionDetection {
  key: string;
  label: string;
  found: boolean;
  confidence: number;
  evidence?: string;
}

export interface JobRequirement {
  id: string;
  type: RequirementType;
  label: string;
  mandatory: boolean;
  matched: boolean;
  evidence: string;
  cvEvidence?: string;
}

export interface AnalysisPenalty {
  code: string;
  label: string;
  points: number;
  reason: string;
}

export interface ScoreDetail {
  score: number;
  weight: number;
  rationale: string;
}

export interface AnalysisScores {
  global: number;
  atsCompatibility: number;
  readability: number;
  matching: number;
  keywordCoverage: number;
  structure: number;
  completeness: number;
  blockingRequirements: number;
  experienceQuality: number;
  contentQuality: number;
  details: {
    keywordCoverage: ScoreDetail;
    blockingRequirements: ScoreDetail;
    structure: ScoreDetail;
    readability: ScoreDetail;
    experienceQuality: ScoreDetail;
    contentQuality: ScoreDetail;
  };
  penalties: AnalysisPenalty[];
}

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  issue: string;
  whyItMatters: string;
  estimatedImpact: number;
  howToFix: string;
  example?: string;
}

export interface ExecutiveSummary {
  verdict: string;
  explanation: string;
  confidenceLevel: number;
}

export interface ExtractionStats {
  characterCount: number;
  wordCount: number;
  lineCount: number;
  denseTextRatio: number;
}

export interface AnalysisReport {
  id: string;
  createdAt: string;
  analysisMode: "with_job" | "ats_only";
  input: UploadMetadata;
  summary: ExecutiveSummary;
  scores: AnalysisScores;
  strengths: string[];
  weaknesses: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  blockingRequirements: JobRequirement[];
  formatRisks: string[];
  extractionStats: ExtractionStats;
  recommendations: Recommendation[];
  cvTextPreview: string;
  limitations: string[];
  detectedSections: SectionDetection[];
  contact: ContactInfo;
}

export interface ParsedJobDescription {
  title?: string;
  seniority?: string;
  hardSkills: string[];
  tools: string[];
  softSkills: string[];
  mandatoryRequirements: JobRequirement[];
  preferredRequirements: JobRequirement[];
  yearsOfExperience?: number;
  languages: string[];
}

export interface ParsedCvProfile {
  normalizedText: string;
  rawText: string;
  contact: ContactInfo;
  sections: SectionDetection[];
  extractedSkills: string[];
  extractedTools: string[];
  languages: string[];
  certifications: string[];
  experienceYears?: number;
  metrics: TextExtractionMetrics;
}
