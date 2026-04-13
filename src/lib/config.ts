const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "ATS Filter Resume",
  maxFileSizeMb: parseNumber(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB, 5),
  reportTtlMinutes: parseNumber(process.env.REPORT_TTL_MINUTES, 30),
};

export const MAX_FILE_SIZE_BYTES = APP_CONFIG.maxFileSizeMb * 1024 * 1024;
