import { z } from "zod";
import { MAX_FILE_SIZE_BYTES } from "@/lib/config";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

const optionalJobDescriptionSchema = z
  .string()
  .max(15_000, "L'offre est trop longue. Reduisez les passages non essentiels.")
  .transform((value) => value.trim())
  .refine((value) => value.length === 0 || value.length >= 80, {
    message: "L'offre semble trop courte. Ajoutez plus de details ou laissez vide pour une analyse ATS generale.",
  });

export const analyzePayloadSchema = z.object({
  jobDescription: optionalJobDescriptionSchema,
});

export const fileSchema = z.object({
  name: z.string().min(1),
  type: z.string().refine((type) => allowedMimeTypes.includes(type as (typeof allowedMimeTypes)[number]), {
    message: "Format non supporte. Importez un PDF ou un DOCX.",
  }),
  size: z
    .number()
    .positive("Fichier invalide.")
    .max(MAX_FILE_SIZE_BYTES, `Le CV depasse ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))} MB.`),
});

export function inferExtension(fileName: string) {
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".pdf")) {
    return "pdf" as const;
  }
  if (lowerName.endsWith(".docx")) {
    return "docx" as const;
  }
  return null;
}
