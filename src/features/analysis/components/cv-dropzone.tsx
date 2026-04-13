"use client";

import { Upload, X } from "lucide-react";
import { MAX_FILE_SIZE_BYTES } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CvDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onInvalidFile?: () => void;
  error?: string;
}

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isValidFile(file: File) {
  const extension = file.name.toLowerCase().split(".").pop();
  if (!extension || !ACCEPTED_EXTENSIONS.includes(`.${extension}`)) {
    return false;
  }
  if (!ACCEPTED_MIME.includes(file.type)) {
    return false;
  }
  return file.size <= MAX_FILE_SIZE_BYTES;
}

export function CvDropzone({ file, onFileChange, onInvalidFile, error }: CvDropzoneProps) {
  const handleFiles = (list: FileList | null) => {
    const selected = list?.[0];
    if (!selected) {
      return;
    }
    if (isValidFile(selected)) {
      onFileChange(selected);
      return;
    }
    onInvalidFile?.();
    onFileChange(null);
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="cv-upload"
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center shadow-hard-xs transition hover:bg-[var(--color-surface-muted)] focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2",
          error && "border-red-700 bg-red-50",
        )}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <Upload className="h-7 w-7 text-[var(--color-border)]" aria-hidden="true" suppressHydrationWarning />
        <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
          Glissez votre CV ici ou cliquez pour selectionner un fichier
        </p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Formats acceptes: PDF, DOCX (max {MAX_FILE_SIZE_BYTES / 1024 / 1024} MB)
        </p>
        <input
          id="cv-upload"
          name="cv"
          type="file"
          accept=".pdf,.docx"
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "cv-error" : undefined}
        />
      </label>

      {file ? (
        <div className="flex items-center justify-between rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-hard-xs">
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">{file.name}</p>
            <p className="text-xs text-[var(--color-muted)]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFileChange(null)}
            aria-label="Supprimer le fichier selectionne"
          >
            <X className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
            Remplacer
          </Button>
        </div>
      ) : null}

      {error ? (
        <p id="cv-error" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

